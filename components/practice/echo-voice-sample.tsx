"use client";

import { Loader2, Volume2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const SAMPLE_TEXT =
  "Hi, I'm Echo, your speaking coach. Hear it, say it, own it — let's get you ready for your IELTS test.";

/**
 * Plays a short ElevenLabs sample through the proxied /api/tts route. Doubles as
 * a live check that the TTS pipeline works end-to-end.
 */
export function EchoVoiceSample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function play() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: SAMPLE_TEXT }),
      });
      if (!res.ok) {
        throw new Error("Echo's voice isn't available right now.");
      }
      const url = URL.createObjectURL(await res.blob());
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.src = url;
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={play} disabled={loading} variant="accent">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Volume2 className="size-4" aria-hidden />
        )}
        Hear Echo say hello
      </Button>
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
