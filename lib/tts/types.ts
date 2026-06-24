/** Text-to-speech provider contract. Output is an audio byte stream so callers
 * can pipe straight to the browser for low-latency playback. */

export interface SynthesizeOptions {
  /** Provider voice id; falls back to the provider's configured default. */
  voiceId?: string;
  /** Output container/codec hint, e.g. "audio/mpeg". */
  format?: string;
}

export interface TtsProvider {
  readonly name: string;
  synthesize(text: string, opts?: SynthesizeOptions): Promise<ReadableStream<Uint8Array>>;
}
