# Echo — IELTS Speaking Coach

Echo is an AI-powered IELTS speaking coach. **Hear it. Say it. Own it.** A
friendly examiner speaks to you (TTS), listens as you answer (STT), replies like
a real IELTS examiner (LLM), and scores you against the official band descriptors.

The MVP is a **Speaking-first vertical slice**; Listening/Reading/Writing come later.

## Stack

- **Next.js 16** (App Router), React 19, **TypeScript strict**
- **Tailwind v4** + small shadcn-style components (`components/ui`)
- **Auth.js (NextAuth v5)** — Google login + guest mode, JWT sessions (`auth.ts`)
- **Neon Postgres** + **Drizzle ORM** (`lib/db`)
- **Mastra** agents over a **multi-provider LLM** layer — default **OpenAI**,
  also Anthropic/Google, via `"provider/model"` ids or AI Gateway (`lib/ai`)
- STT/TTS **provider registries** — Deepgram + ElevenLabs by default (`lib/stt`, `lib/tts`)
- **Gemini Live** S2S as an experimental Mode B (`lib/ai/realtime`, M7)
- **Vercel Blob** for audio, **Zustand** + **TanStack Query** for client state
- **Vitest** + Playwright for tests

## Commands

```bash
pnpm dev            # run locally (boots in guest/no-secrets mode)
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm test           # vitest run
pnpm format         # prettier --write .
pnpm db:generate    # drizzle migration from schema
pnpm db:push        # push schema to Neon
```

## Conventions

- Server Components by default; `"use client"` only on interactive leaves.
- Validate every boundary with **Zod** (API inputs, env in `lib/env.ts`, LLM output).
- **Secrets never reach the client** — STT uses ephemeral tokens; TTS/LLM are proxied.
- AI prompts live as **versioned exports** in `lib/ai/agents`, never inline strings.
- Files kebab-case, components PascalCase, hooks `useX`. Path alias `@/`.
- User-facing copy is warm and never blames the learner. a11y first (captions,
  keyboard, reduced-motion).

## Two conversation modes (one interface)

Both implement `ConversationEngine` (`lib/conversation/types.ts`):

- **Mode A — chained:** STT → examiner agent → TTS (default).
- **Mode B — live:** Gemini Live single bidirectional stream (experimental, flag
  `NEXT_PUBLIC_CONVERSATION_MODE=live`). Scoring runs the same scorer agent.

## Where things live

- `lib/ielts/` — band descriptors, examiner-flow state machine, question bank (UI-free domain logic).
- `lib/ai/` — Mastra instance, examiner + scorer agents, model factory, scoring schema.
- `lib/db/` — Drizzle schema + Neon client.
- `lib/stt` / `lib/tts` — provider registries + adapters.
- `app/api/` — speaking session/turn/score routes, stt/tts/realtime token routes.

See `.claude/skills/` for deeper, task-scoped guidance (rubrics, examiner persona,
design system, AI pipeline, adding a new practice module).
