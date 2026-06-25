"use client";

import { LiveSpeakingSession } from "@/components/practice/live-speaking-session";
import { SpeakingSession } from "@/components/practice/speaking-session";
import { useConversationMode } from "@/hooks/use-conversation-mode";

/**
 * Picks the conversation engine from the user's saved preference (Settings →
 * Conversation engine), defaulting to the deploy-time mode. Both branches render
 * the same UI surface and feed the same scorer, so the only difference is how the
 * live turn is produced.
 */
export function SpeakingSurface() {
  const mode = useConversationMode();
  return mode === "live" ? <LiveSpeakingSession /> : <SpeakingSession />;
}
