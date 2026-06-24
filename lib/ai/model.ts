import { env } from "@/lib/env";
import { DEFAULT_LLM_PROVIDER } from "./providers";

/**
 * Model ids in Mastra's "provider/model" form. Mastra resolves these to a
 * concrete model at runtime: it uses the provider's API key when present
 * (e.g. OPENAI_API_KEY) and otherwise routes through the AI Gateway.
 *
 * Defaults to OpenAI; override the provider via ECHO_LLM_PROVIDER and the exact
 * models via ECHO_EXAMINER_MODEL / ECHO_SCORER_MODEL.
 */
function normalizeId(id: string): `${string}/${string}` {
  return (id.includes("/") ? id : `${DEFAULT_LLM_PROVIDER}/${id}`) as `${string}/${string}`;
}

/** Fast, conversational model for the live examiner turns. */
export const examinerModelId = normalizeId(env.ECHO_EXAMINER_MODEL);

/** Higher-quality model for the final band scoring pass. */
export const scorerModelId = normalizeId(env.ECHO_SCORER_MODEL);
