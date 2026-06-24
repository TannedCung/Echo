import { requireEnv } from "@/lib/env";
import type { EphemeralToken, SttProvider } from "./types";

/**
 * Deepgram realtime STT adapter. The ephemeral-token issuance and streaming
 * wiring are completed in Milestone 3; this skeleton validates config and
 * pins the contract.
 */
export const deepgramProvider: SttProvider = {
  name: "deepgram",

  async createEphemeralToken(): Promise<EphemeralToken> {
    requireEnv("DEEPGRAM_API_KEY");
    // M3: POST https://api.deepgram.com/v1/auth/grant to mint a scoped key.
    throw new Error("Deepgram ephemeral token issuance is implemented in Milestone 3.");
  },
};
