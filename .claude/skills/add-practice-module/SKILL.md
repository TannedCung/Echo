---
name: add-practice-module
description: Recipe for adding a new IELTS skill module (Listening, Reading, or Writing) following Echo's established Speaking pattern. Use when extending beyond Speaking.
---

# Add a practice module

Echo ships Speaking first. New skills reuse the same shape so the codebase stays
consistent. To add e.g. **Writing**:

1. **Domain logic** (UI-free) in `lib/ielts/`:
   - Reuse the band criteria pattern from `band-descriptors.ts` (Writing has its
     own four criteria: Task Achievement, Coherence & Cohesion, Lexical Resource,
     Grammatical Range & Accuracy).
   - Add any flow/state machine if the task is multi-step.

2. **AI agent** in `lib/ai/agents/`:
   - Add a versioned-instructions agent (e.g. `writing-scorer-agent.ts`) and a
     Zod output schema mirroring `scoring-schema.ts`.
   - Register it on the Mastra instance in `lib/ai/mastra.ts`.

3. **Data model** in `lib/db/schema.ts`:
   - Namespace new tables by skill (e.g. `writing_submissions`, `writing_scores`).
     Run `pnpm db:generate` then `pnpm db:push`.

4. **Routes** in `app/api/<skill>/...` — keep the no-secrets-on-client rule.

5. **UI** under `app/(app)/practice/<skill>/` — reuse `components/ui` and the
   Friendly design tokens; add an entry on the dashboard.

6. **Tests** — add unit tests for new pure logic (band math, schema parsing).

Keep modules independent: a new skill must not require changes to Speaking.

@lib/ielts/band-descriptors.ts
@lib/ai/scoring-schema.ts
@lib/db/schema.ts
