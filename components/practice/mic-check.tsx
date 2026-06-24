"use client";

import { Loader2, Mic, Square } from "lucide-react";
import { useState } from "react";

import { EchoMascot } from "@/components/mascot/echo-mascot";
import { Button } from "@/components/ui/button";
import { useRecorder } from "@/hooks/use-recorder";

/**
 * Records a short clip, shows a live input level (Echo reacts by "listening"),
 * and sends the audio to /api/stt/transcribe. Surfaces a friendly hint if STT
 * isn't configured yet, so the capture path is testable before the key lands.
 */
export function MicCheck() {
  const { status, error, level, start, stop } = useRecorder();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const recording = status === "recording";

  async function handleStop() {
    const blob = await stop();
    if (!blob) return;
    setTranscribing(true);
    setHint(null);
    setTranscript(null);
    try {
      const res = await fetch("/api/stt/transcribe", {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      if (res.status === 501 || res.status === 502) {
        setHint("Add your Deepgram key to turn on live transcription.");
        return;
      }
      if (!res.ok) {
        setHint("Couldn't transcribe that clip — give it another go.");
        return;
      }
      const data = (await res.json()) as { text?: string };
      setTranscript(data.text?.trim() || "(no speech detected)");
    } catch {
      setHint("Couldn't reach transcription just now.");
    } finally {
      setTranscribing(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <EchoMascot state={recording ? "listening" : "idle"} size="md" />

      <div
        className="bg-muted h-2 w-48 overflow-hidden rounded-full"
        role="meter"
        aria-label="Microphone input level"
        aria-valuenow={Math.round(level * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-75"
          style={{ width: `${Math.round(level * 100)}%` }}
        />
      </div>

      {!recording ? (
        <Button onClick={start}>
          <Mic className="size-4" aria-hidden /> Test your mic
        </Button>
      ) : (
        <Button variant="accent" onClick={handleStop}>
          <Square className="size-4" aria-hidden /> Stop
        </Button>
      )}

      {transcribing && (
        <p className="text-muted-foreground inline-flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Transcribing…
        </p>
      )}
      {transcript && (
        <p className="bg-muted max-w-md rounded-2xl px-4 py-2 text-center text-sm">{transcript}</p>
      )}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
