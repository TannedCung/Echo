---
name: ielts-rubrics
description: IELTS Speaking band descriptors and scoring philosophy. Use when editing the scorer agent, scoring schema, band math, or any feedback/report UI.
---

# IELTS Speaking rubrics

Echo scores against the four official IELTS Speaking criteria, each 0–9 in
half-band steps. The single source of truth is `lib/ielts/band-descriptors.ts`
(criteria, anchors, `overallBand`, `roundToBand`).

## The four criteria

1. **Fluency & Coherence** — flow, logical sequencing, connectives, hesitation.
2. **Lexical Resource** — range, precision, idiom, paraphrase, collocation.
3. **Grammatical Range & Accuracy** — variety of structures and their accuracy.
4. **Pronunciation** — stress, rhythm, intonation, intelligibility.

Overall band = average of the four, rounded to the nearest half band.

## Rules

- Never invent criteria or scales — reuse `SPEAKING_CRITERIA` and `CRITERIA_INFO`.
- Scorer output MUST conform to `lib/ai/scoring-schema.ts` (Zod). Every criterion
  needs a band, short verbatim evidence quotes, and a one-line comment.
- Be honest but kind; never inflate. Upgrades are concrete and encouraging.
- When you change scoring logic, update `tests/band-descriptors.test.ts`.

@lib/ielts/band-descriptors.ts
@lib/ai/scoring-schema.ts
