import { requireEnv } from "@/lib/env";
import type { EphemeralToken, SttProvider, TranscriptResult } from "./types";

/**
 * OpenAI (Whisper) STT adapter — one-shot transcription, reusing OPENAI_API_KEY.
 * Selected via ECHO_STT_PROVIDER=openai. It has no browser-streaming token; the
 * realtime path is Deepgram's job (see deepgram.ts), while the chained pipeline
 * posts a complete clip to /api/stt/transcribe.
 */

const TRANSCRIBE_URL = "https://api.openai.com/v1/audio/transcriptions";
const DEFAULT_MODEL = "gpt-4o-mini-transcribe";

function extensionFor(mimeType: string): string {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "mp3";
  return "webm";
}

export const openaiSttProvider: SttProvider = {
  name: "openai",

  async createEphemeralToken(): Promise<EphemeralToken> {
    throw new Error(
      "OpenAI STT is one-shot only — use /api/stt/transcribe, or Deepgram for realtime streaming.",
    );
  },

  async transcribe(audio: ArrayBuffer, mimeType: string): Promise<TranscriptResult> {
    const apiKey = requireEnv("OPENAI_API_KEY");

    const form = new FormData();
    form.append("file", new Blob([audio], { type: mimeType }), `audio.${extensionFor(mimeType)}`);
    form.append("model", DEFAULT_MODEL);

    const res = await fetch(TRANSCRIBE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!res.ok) {
      throw new Error(`OpenAI transcription failed (${res.status}): ${await res.text()}`);
    }

    const data = (await res.json()) as { text?: string };
    return { text: data.text ?? "" };
  },
};
