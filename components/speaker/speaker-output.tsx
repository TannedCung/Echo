import type { MascotSize, MascotState } from "@/components/mascot/echo-mascot";
import { SPEAKER_KIND } from "@/lib/speaker/speaker-kind";

import { AvatarSpeaker } from "./avatar-speaker";
import { MascotSpeaker } from "./mascot-speaker";

export interface SpeakerOutputProps {
  /** The examiner's current state — both speakers render the same beats. */
  state: MascotState;
  size?: MascotSize;
  /** Overrides the default accessible label. */
  label?: string;
}

/**
 * The examiner's speaking presence — the seam a lip-synced avatar swaps into.
 * Both implementations consume the same examiner `state`, so the speaking UI is
 * presence-agnostic: the mascot ships today, and `NEXT_PUBLIC_SPEAKER=avatar`
 * selects the avatar (post-MVP) without touching any call site.
 */
export function SpeakerOutput(props: SpeakerOutputProps) {
  return SPEAKER_KIND === "avatar" ? <AvatarSpeaker {...props} /> : <MascotSpeaker {...props} />;
}
