import { env } from "@/lib/env";
import { deepgramProvider } from "./deepgram";
import type { SttProvider } from "./types";

const providers = new Map<string, SttProvider>();

export function registerSttProvider(provider: SttProvider) {
  providers.set(provider.name, provider);
}

registerSttProvider(deepgramProvider);

/** Resolve an STT provider by name, defaulting to ECHO_STT_PROVIDER. */
export function getSttProvider(name: string = env.ECHO_STT_PROVIDER): SttProvider {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(
      `Unknown STT provider "${name}". Registered: ${[...providers.keys()].join(", ")}`,
    );
  }
  return provider;
}

export type { SttProvider } from "./types";
