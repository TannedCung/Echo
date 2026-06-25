import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validated environment access. Integration keys are optional so the app can
 * boot in a no-secrets dev mode; runtime code that needs a key should assert
 * its presence at the point of use (see `requireEnv`).
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().optional(),

    // Auth.js (NextAuth). Google is active only when both id+secret are set.
    AUTH_SECRET: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),

    // LLM — multi-provider, default OpenAI. Set the matching provider key.
    ECHO_LLM_PROVIDER: z.string().default("openai"),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    AI_GATEWAY_API_KEY: z.string().optional(),
    ECHO_EXAMINER_MODEL: z.string().default("openai/gpt-4o-mini"),
    ECHO_SCORER_MODEL: z.string().default("openai/gpt-4o"),

    ECHO_STT_PROVIDER: z.string().default("deepgram"),
    DEEPGRAM_API_KEY: z.string().optional(),

    ECHO_TTS_PROVIDER: z.string().default("elevenlabs"),
    ELEVENLABS_API_KEY: z.string().optional(),
    ELEVENLABS_VOICE_ID: z.string().optional(),

    GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
    // Gemini Live (Mode B). The native-audio S2S model the realtime engine uses.
    ECHO_LIVE_MODEL: z.string().default("gemini-3.1-flash-live-preview"),

    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CONVERSATION_MODE: z.enum(["chained", "live"]).default("chained"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    ECHO_LLM_PROVIDER: process.env.ECHO_LLM_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    ECHO_EXAMINER_MODEL: process.env.ECHO_EXAMINER_MODEL,
    ECHO_SCORER_MODEL: process.env.ECHO_SCORER_MODEL,
    ECHO_STT_PROVIDER: process.env.ECHO_STT_PROVIDER,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    ECHO_TTS_PROVIDER: process.env.ECHO_TTS_PROVIDER,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    ECHO_LIVE_MODEL: process.env.ECHO_LIVE_MODEL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_CONVERSATION_MODE: process.env.NEXT_PUBLIC_CONVERSATION_MODE,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

/** True when Google OAuth is configured (otherwise only guest mode is offered). */
export const isGoogleAuthConfigured = !!env.AUTH_GOOGLE_ID && !!env.AUTH_GOOGLE_SECRET;

/** True when the Gemini Live (Mode B) realtime engine can be used. */
export const isLiveConfigured = !!env.GOOGLE_GENERATIVE_AI_API_KEY;

/** Assert an optional server env var is present at the point of use. */
export function requireEnv<K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }
  return value as NonNullable<(typeof env)[K]>;
}
