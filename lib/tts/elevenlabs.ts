import { env, requireEnv } from "@/lib/env";
import type { SynthesizeOptions, TtsProvider } from "./types";

/**
 * ElevenLabs streaming TTS adapter — Echo's friendly examiner voice. Returns the
 * response body directly so the API route can pipe audio to the browser for
 * low-latency playback. The long-lived key stays server-side.
 */

const BASE_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_MODEL = "eleven_turbo_v2_5";
/** "Rachel" — a warm public ElevenLabs voice; override via ELEVENLABS_VOICE_ID. */
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_OUTPUT_FORMAT = "mp3_44100_128";

export const elevenlabsProvider: TtsProvider = {
  name: "elevenlabs",

  async synthesize(text: string, opts?: SynthesizeOptions): Promise<ReadableStream<Uint8Array>> {
    const apiKey = requireEnv("ELEVENLABS_API_KEY");
    const voiceId = opts?.voiceId ?? env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;
    const outputFormat = opts?.format ?? DEFAULT_OUTPUT_FORMAT;

    const res = await fetch(
      `${BASE_URL}/${voiceId}/stream?output_format=${encodeURIComponent(outputFormat)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: DEFAULT_MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!res.ok || !res.body) {
      throw new Error(`ElevenLabs synthesis failed (${res.status}): ${await res.text()}`);
    }

    return res.body;
  },
};
