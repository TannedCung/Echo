import { env } from "@/lib/env";

/**
 * Supported LLM providers. Mastra resolves a `"provider/model"` id to the right
 * AI SDK provider at runtime, picking up the matching API key (or routing
 * through the AI Gateway). Add a provider here + install its `@ai-sdk/*` package
 * to make it selectable — call sites never change.
 */
export const LLM_PROVIDERS = {
  openai: { envKey: "OPENAI_API_KEY", label: "OpenAI" },
  anthropic: { envKey: "ANTHROPIC_API_KEY", label: "Anthropic (Claude)" },
  google: { envKey: "GOOGLE_GENERATIVE_AI_API_KEY", label: "Google (Gemini)" },
} as const;

export type LlmProvider = keyof typeof LLM_PROVIDERS;

export function isLlmProvider(value: string): value is LlmProvider {
  return value in LLM_PROVIDERS;
}

/** Default provider for bare model ids, configurable via ECHO_LLM_PROVIDER. */
export const DEFAULT_LLM_PROVIDER: LlmProvider = isLlmProvider(env.ECHO_LLM_PROVIDER)
  ? env.ECHO_LLM_PROVIDER
  : "openai";
