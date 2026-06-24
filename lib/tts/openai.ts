import { requireEnv } from "@/lib/env";
import type { SynthesizeOptions, TtsProvider } from "./types";

/**
 * OpenAI text-to-speech adapter. Useful as a drop-in alternative to ElevenLabs
 * (e.g. when the ElevenLabs plan can't use API voices) — selected via
 * ECHO_TTS_PROVIDER=openai. Reuses the existing OPENAI_API_KEY.
 */

const SPEECH_URL = "https://api.openai.com/v1/audio/speech";
const DEFAULT_MODEL = "gpt-4o-mini-tts";
/** OpenAI built-in voices: alloy, echo, fable, onyx, nova, shimmer. */
const DEFAULT_VOICE = "alloy";

export const openaiProvider: TtsProvider = {
  name: "openai",

  async synthesize(text: string, opts?: SynthesizeOptions): Promise<ReadableStream<Uint8Array>> {
    const apiKey = requireEnv("OPENAI_API_KEY");

    const res = await fetch(SPEECH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        voice: opts?.voiceId ?? DEFAULT_VOICE,
        input: text,
        response_format: "mp3",
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`OpenAI TTS failed (${res.status}): ${await res.text()}`);
    }

    return res.body;
  },
};
