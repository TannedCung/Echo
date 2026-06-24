/** Speech-to-text provider contract. Adapters register against this so the rest
 * of the app depends on the interface, never a specific vendor. */

export interface EphemeralToken {
  provider: string;
  token: string;
  /** Epoch millis when the token expires. */
  expiresAt: number;
  /** Provider-specific connection hints (e.g. websocket URL, model). */
  meta?: Record<string, string>;
}

export interface TranscriptResult {
  text: string;
  /** 0–1 provider confidence, when available. */
  confidence?: number;
}

export interface SttProvider {
  readonly name: string;
  /** Mint a short-lived token so the browser can stream audio directly to the
   * provider without exposing the long-lived API key. */
  createEphemeralToken(): Promise<EphemeralToken>;
  /** Optional one-shot transcription of a complete audio buffer. */
  transcribe?(audio: ArrayBuffer, mimeType: string): Promise<TranscriptResult>;
}
