import { env } from "@/lib/env";
import { elevenlabsProvider } from "./elevenlabs";
import type { TtsProvider } from "./types";

const providers = new Map<string, TtsProvider>();

export function registerTtsProvider(provider: TtsProvider) {
  providers.set(provider.name, provider);
}

registerTtsProvider(elevenlabsProvider);

/** Resolve a TTS provider by name, defaulting to ECHO_TTS_PROVIDER. */
export function getTtsProvider(name: string = env.ECHO_TTS_PROVIDER): TtsProvider {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(
      `Unknown TTS provider "${name}". Registered: ${[...providers.keys()].join(", ")}`,
    );
  }
  return provider;
}

export type { TtsProvider } from "./types";
