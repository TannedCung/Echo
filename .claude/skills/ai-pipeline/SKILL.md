---
name: ai-pipeline
description: How Echo's speaking pipeline wires together — Mastra agents, STT/TTS registries, the ConversationEngine seam (Mode A vs B), and the no-secrets-on-client rule. Use when touching AI, audio, or the speaking session.
---

# AI pipeline

## Layers

- **Mastra agents** (`lib/ai`): `examinerAgent` (live turns) and `scorerAgent`
  (final band scoring). The LLM layer is multi-provider via `lib/ai/providers.ts`
  + `lib/ai/model.ts` — default **OpenAI** (`ECHO_LLM_PROVIDER`), also Anthropic/
  Google. Bare model ids get the default provider prefix; direct key when present,
  else AI Gateway. Add a provider in `providers.ts` + install its `@ai-sdk/*` pkg.
- **STT registry** (`lib/stt`): `getSttProvider()` resolves `ECHO_STT_PROVIDER`
  (default `deepgram`). Adapters implement `SttProvider`.
- **TTS registry** (`lib/tts`): `getTtsProvider()` resolves `ECHO_TTS_PROVIDER`
  (default `elevenlabs`). Adapters implement `TtsProvider`.

## ConversationEngine seam (`lib/conversation/types.ts`)

The UI depends only on `ConversationEngine`, never on a mode:

- **Mode A — chained:** mic → STT → `examinerAgent` (SSE) → TTS → playback.
- **Mode B — live:** Gemini Live single bidirectional stream. Scoring still runs
  `scorerAgent` on the captured transcript so reports are identical.

Selected by `NEXT_PUBLIC_CONVERSATION_MODE` (`chained` | `live`).

## Hard rules

- **No secrets on the client.** STT/realtime use short-lived ephemeral tokens
  minted server-side (`/api/stt/token`, `/api/realtime/token`); TTS and the LLM
  are fully proxied. Never expose `*_API_KEY` to the browser.
- Add a new STT/TTS vendor by writing an adapter + calling `registerSttProvider`/
  `registerTtsProvider` — never change call sites.
- Scorer output is Zod-validated (`lib/ai/scoring-schema.ts`).

@lib/conversation/types.ts
@lib/ai/mastra.ts
@lib/stt/registry.ts
@lib/tts/registry.ts
