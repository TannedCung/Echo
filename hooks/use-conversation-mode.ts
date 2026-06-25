"use client";

import { useSyncExternalStore } from "react";

/**
 * The two interchangeable conversation engines (see CLAUDE.md → "Two
 * conversation modes"). Both implement `ConversationEngine` and run the same
 * scorer, so the choice is purely how the live turn is produced:
 *
 * - `chained` — Mode A: STT → examiner agent → TTS (default, most transparent).
 * - `live`    — Mode B: Gemini Live single bidirectional S2S stream.
 */
export type ConversationMode = "chained" | "live";

export const CONVERSATION_MODES: ConversationMode[] = ["chained", "live"];

/** localStorage key for the user's chosen engine; survives across sessions. */
const STORAGE_KEY = "echo-conversation-mode";
const CHANGE_EVENT = "echo-conversation-mode-change";

/**
 * The deploy-time default. `NEXT_PUBLIC_CONVERSATION_MODE` is statically inlined
 * by Next, so this is safe to read on the client. The stored preference (set in
 * Settings) overrides it per browser.
 */
export const DEFAULT_CONVERSATION_MODE: ConversationMode =
  process.env.NEXT_PUBLIC_CONVERSATION_MODE === "live" ? "live" : "chained";

function isMode(value: string | null): value is ConversationMode {
  return value === "chained" || value === "live";
}

function getSnapshot(): ConversationMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isMode(stored)) return stored;
  } catch {
    // ignore storage failures (private mode) — fall back to the default
  }
  return DEFAULT_CONVERSATION_MODE;
}

function subscribe(onChange: () => void): () => void {
  // `storage` fires for changes in other tabs; the custom event covers this one.
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setConversationMode(mode: ConversationMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore storage failures; the in-session value still updates via the event
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Reads the active conversation engine. Returns the deploy default during SSR
 * and the first client render (no hydration mismatch), then reflects the stored
 * preference. Components that key whole subtrees off this swap after mount.
 */
export function useConversationMode(): ConversationMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_CONVERSATION_MODE);
}
