import { requireEnv } from "@/lib/env";
import type { SynthesizeOptions, TtsProvider } from "./types";

/**
 * ElevenLabs streaming TTS adapter (default voice for "Echo"). Streaming wiring
 * is completed in Milestone 3; this skeleton validates config and pins the
 * contract.
 */
export const elevenlabsProvider: TtsProvider = {
  name: "elevenlabs",

  async synthesize(_text: string, _opts?: SynthesizeOptions): Promise<ReadableStream<Uint8Array>> {
    requireEnv("ELEVENLABS_API_KEY");
    // M3: POST to ElevenLabs /v1/text-to-speech/{voice}/stream and return the body.
    throw new Error("ElevenLabs synthesis is implemented in Milestone 3.");
  },
};
