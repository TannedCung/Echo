import { requireEnv } from "@/lib/env";
import type { EphemeralToken, SttProvider, TranscriptResult } from "./types";

/**
 * Deepgram STT adapter.
 *
 * - `createEphemeralToken` mints a short-lived token (Deepgram's `auth/grant`)
 *   so the browser can open a realtime websocket without ever seeing the
 *   project API key.
 * - `transcribe` is a one-shot fallback for a complete audio buffer.
 */

const GRANT_URL = "https://api.deepgram.com/v1/auth/grant";
const LISTEN_HTTP_URL = "https://api.deepgram.com/v1/listen";
const LISTEN_WS_URL = "wss://api.deepgram.com/v1/listen";
const DEFAULT_MODEL = "nova-2";
/** Token lifetime; the browser must open its socket promptly after fetching. */
const TOKEN_TTL_SECONDS = 60;

export const deepgramProvider: SttProvider = {
  name: "deepgram",

  async createEphemeralToken(): Promise<EphemeralToken> {
    const apiKey = requireEnv("DEEPGRAM_API_KEY");

    const res = await fetch(GRANT_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: TOKEN_TTL_SECONDS }),
    });

    if (!res.ok) {
      throw new Error(`Deepgram token grant failed (${res.status}): ${await res.text()}`);
    }

    const data = (await res.json()) as { access_token: string; expires_in: number };
    return {
      provider: "deepgram",
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      meta: {
        // The browser connects with: new WebSocket(`${wsUrl}?...`, ["token", token])
        wsUrl: LISTEN_WS_URL,
        model: DEFAULT_MODEL,
      },
    };
  },

  async transcribe(audio: ArrayBuffer, mimeType: string): Promise<TranscriptResult> {
    const apiKey = requireEnv("DEEPGRAM_API_KEY");

    const params = new URLSearchParams({
      model: DEFAULT_MODEL,
      smart_format: "true",
      punctuate: "true",
    });

    const res = await fetch(`${LISTEN_HTTP_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": mimeType,
      },
      body: audio,
    });

    if (!res.ok) {
      throw new Error(`Deepgram transcription failed (${res.status}): ${await res.text()}`);
    }

    const data = (await res.json()) as {
      results?: {
        channels?: Array<{ alternatives?: Array<{ transcript?: string; confidence?: number }> }>;
      };
    };
    const alternative = data.results?.channels?.[0]?.alternatives?.[0];
    return { text: alternative?.transcript ?? "", confidence: alternative?.confidence };
  },
};
