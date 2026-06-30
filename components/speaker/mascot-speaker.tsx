import { EchoMascot } from "@/components/mascot/echo-mascot";

import type { SpeakerOutputProps } from "./speaker-output";

/** Default speaker: the animated Echo mascot reacting to the examiner state. */
export function MascotSpeaker({ state, size, label }: SpeakerOutputProps) {
  return <EchoMascot state={state} size={size} label={label} />;
}
