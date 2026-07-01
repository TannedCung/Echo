import { z } from "zod";

/** Half-band score in the IELTS 0–9 range. */
const bandScore = z
  .number()
  .min(0)
  .max(9)
  .refine((n) => Number.isInteger(n * 2), { message: "Bands use half-band steps" });

const criterionResult = z.object({
  band: bandScore,
  evidence: z.array(z.string()).describe("Short verbatim quotes from the candidate's writing"),
  comment: z.string().describe("One-sentence justification"),
});

/**
 * Structured output contract for the Writing scorer agent. Enforced at the
 * scoring route so the model always returns a parseable, UI-ready assessment.
 * Mirrors the Speaking scoring schema, with the four Writing criteria.
 */
export const writingScoringSchema = z.object({
  taskResponse: criterionResult,
  coherenceCohesion: criterionResult,
  lexicalResource: criterionResult,
  grammaticalRange: criterionResult,
  overall: bandScore,
  upgrades: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("Actionable, encouraging suggestions to raise the band"),
  summary: z.string().describe("Warm 2–3 sentence summary"),
});

export type WritingScoringResult = z.infer<typeof writingScoringSchema>;
