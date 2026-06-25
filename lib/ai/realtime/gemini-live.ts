import { GoogleGenAI, Modality, type LiveServerMessage, type Session } from "@google/genai";

import { buildLiveInstructions } from "@/lib/ai/realtime/live-instructions";
import type {
  ConversationCallbacks,
  ConversationEngine,
  ConversationSessionConfig,
} from "@/lib/conversation/types";

const INPUT_SAMPLE_RATE = 16000; // Live API expects 16 kHz PCM input
const OUTPUT_SAMPLE_RATE = 24000; // Live API returns 24 kHz PCM audio

/** The capture worklet forwards mono Float32 frames to the main thread. */
const CAPTURE_WORKLET = `
class EchoCapture extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0]?.[0];
    if (ch) this.port.postMessage(ch.slice(0));
    return true;
  }
}
registerProcessor("echo-capture", EchoCapture);
`;

function floatToPcm16Base64(samples: Float32Array): string {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToInt16(data: string): Int16Array {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

/**
 * Mode B conversation engine: a single bidirectional Gemini Live stream. The
 * browser captures the mic, streams 16 kHz PCM up, and plays the model's 24 kHz
 * PCM reply back — the model handles turn-taking (VAD) itself. Implements the
 * same `ConversationEngine` seam as the chained engine so the speaking UI is
 * mode-agnostic; the captured transcript still feeds the shared scorer agent.
 */
export class GeminiLiveEngine implements ConversationEngine {
  readonly mode = "live" as const;

  private session: Session | null = null;
  private callbacks: ConversationCallbacks = {};

  private micStream: MediaStream | null = null;
  private inputCtx: AudioContext | null = null;
  private worklet: AudioWorkletNode | null = null;

  private outputCtx: AudioContext | null = null;
  private playHead = 0; // scheduled-audio cursor for gapless 24 kHz playback

  // Accumulated text for the current streaming turn, flushed on turnComplete.
  private candidateText = "";
  private examinerText = "";

  async start(config: ConversationSessionConfig, callbacks: ConversationCallbacks): Promise<void> {
    this.callbacks = callbacks;

    // 1. Exchange the server key for a short-lived ephemeral token.
    const res = await fetch("/api/realtime/token", { method: "POST" });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? "Couldn't start a live session.");
    }
    const { token, model } = (await res.json()) as { token: string; model: string };

    // 2. Open the Live session with the token (raw key never reaches the client).
    const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: "v1alpha" } });
    this.session = await ai.live.connect({
      model,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: buildLiveInstructions(config.speakingMode),
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message) => this.handleMessage(message),
        onerror: (e: ErrorEvent) =>
          this.callbacks.onError?.(new Error(e.message || "Live connection error.")),
        onclose: () => {},
      },
    });

    // 3. Start streaming the mic.
    await this.startCapture();
  }

  /** With automatic VAD the model detects end-of-speech; signal it explicitly too. */
  endTurn(): void {
    this.session?.sendRealtimeInput({ audioStreamEnd: true });
  }

  async stop(): Promise<void> {
    this.worklet?.disconnect();
    this.worklet = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    await this.inputCtx?.close().catch(() => {});
    this.inputCtx = null;
    await this.outputCtx?.close().catch(() => {});
    this.outputCtx = null;
    this.session?.close();
    this.session = null;
  }

  private async startCapture(): Promise<void> {
    this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.inputCtx = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
    const blobUrl = URL.createObjectURL(
      new Blob([CAPTURE_WORKLET], { type: "application/javascript" }),
    );
    await this.inputCtx.audioWorklet.addModule(blobUrl);
    URL.revokeObjectURL(blobUrl);

    const source = this.inputCtx.createMediaStreamSource(this.micStream);
    this.worklet = new AudioWorkletNode(this.inputCtx, "echo-capture");
    this.worklet.port.onmessage = (event: MessageEvent<Float32Array>) => {
      if (!this.session) return;
      this.session.sendRealtimeInput({
        audio: {
          data: floatToPcm16Base64(event.data),
          mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
        },
      });
    };
    source.connect(this.worklet);
    // The worklet needs a sink to pull frames, but we don't want to hear the mic.
    const mute = this.inputCtx.createGain();
    mute.gain.value = 0;
    this.worklet.connect(mute).connect(this.inputCtx.destination);
  }

  private handleMessage(message: LiveServerMessage): void {
    const content = message.serverContent;
    if (!content) return;

    if (content.interrupted) this.resetPlayback(); // candidate barge-in

    if (content.inputTranscription?.text) {
      this.candidateText += content.inputTranscription.text;
      this.callbacks.onCandidateText?.({
        role: "candidate",
        text: this.candidateText,
        partial: true,
      });
    }
    if (content.outputTranscription?.text) {
      this.examinerText += content.outputTranscription.text;
      this.callbacks.onExaminerText?.({
        role: "examiner",
        text: this.examinerText,
        partial: true,
      });
    }

    for (const part of content.modelTurn?.parts ?? []) {
      if (part.inlineData?.data) this.playChunk(part.inlineData.data);
    }

    if (content.turnComplete) {
      if (this.candidateText) {
        this.callbacks.onCandidateText?.({ role: "candidate", text: this.candidateText });
      }
      if (this.examinerText) {
        this.callbacks.onExaminerText?.({ role: "examiner", text: this.examinerText });
      }
      this.candidateText = "";
      this.examinerText = "";
    }
  }

  /** Schedules a 24 kHz PCM chunk to play immediately after the previous one. */
  private playChunk(data: string): void {
    if (!this.outputCtx) {
      this.outputCtx = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
      this.playHead = this.outputCtx.currentTime;
    }
    const pcm = base64ToInt16(data);
    const buffer = this.outputCtx.createBuffer(1, pcm.length, OUTPUT_SAMPLE_RATE);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 0x8000;

    const node = this.outputCtx.createBufferSource();
    node.buffer = buffer;
    node.connect(this.outputCtx.destination);
    this.playHead = Math.max(this.playHead, this.outputCtx.currentTime);
    node.start(this.playHead);
    this.playHead += buffer.duration;
  }

  private resetPlayback(): void {
    if (!this.outputCtx) return;
    void this.outputCtx.close().catch(() => {});
    this.outputCtx = null;
    this.playHead = 0;
  }
}
