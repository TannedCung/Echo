import { MascotSpeaker } from "./mascot-speaker";
import type { SpeakerOutputProps } from "./speaker-output";

/**
 * Lip-synced avatar speaker (post-MVP). Wiring a provider (Simli / HeyGen) means
 * mounting their video element here, driven by the same examiner `state` and the
 * examiner's TTS audio stream. Until that lands it falls back to the mascot, so
 * flipping `NEXT_PUBLIC_SPEAKER=avatar` is always safe — the examiner is never
 * left faceless — and the rest of the speaking UI needs no changes.
 */
export function AvatarSpeaker(props: SpeakerOutputProps) {
  // TODO(avatar): mount the provider's lip-synced <video> here, fed by the TTS
  // audio stream; keep the mascot as the loading/fallback presence.
  return <MascotSpeaker {...props} />;
}
