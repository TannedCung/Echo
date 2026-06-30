/**
 * Which surface gives the examiner a face while it speaks. The mascot ships
 * today; a lip-synced avatar (Simli / HeyGen) is a post-MVP swap behind the same
 * `SpeakerOutput` seam, selected by the `NEXT_PUBLIC_SPEAKER` deploy flag.
 *
 * Kept UI-free and pure so the resolver is unit-testable; the React seam lives
 * in `components/speaker/`.
 */
export type SpeakerKind = "mascot" | "avatar";

export const SPEAKER_KINDS: SpeakerKind[] = ["mascot", "avatar"];

/** Normalises a raw flag value to a known speaker, defaulting to the mascot. */
export function resolveSpeakerKind(raw?: string | null): SpeakerKind {
  return raw === "avatar" ? "avatar" : "mascot";
}

/**
 * The deploy-time speaker. `NEXT_PUBLIC_SPEAKER` is statically inlined by Next,
 * so this is safe to read on the client. Defaults to the mascot.
 */
export const SPEAKER_KIND: SpeakerKind = resolveSpeakerKind(process.env.NEXT_PUBLIC_SPEAKER);
