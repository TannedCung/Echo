"use client";

import { Check, Radio, Workflow } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  type ConversationMode,
  setConversationMode,
  useConversationMode,
} from "@/hooks/use-conversation-mode";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  name: string;
  isGuest: boolean;
  /** Whether the Gemini Live key is configured server-side (Mode B usable). */
  liveAvailable: boolean;
}

interface EngineOption {
  mode: ConversationMode;
  label: string;
  tagline: string;
  description: string;
  icon: typeof Workflow;
}

const ENGINES: EngineOption[] = [
  {
    mode: "chained",
    label: "Chained pipeline",
    tagline: "Speech-to-text → examiner → speech",
    description:
      "The default. Your words are transcribed, the examiner replies, and the reply is spoken back. Most transparent — every step is visible.",
    icon: Workflow,
  },
  {
    mode: "live",
    label: "Live voice (S2S)",
    tagline: "Gemini Live · single audio stream",
    description:
      "Experimental. One bidirectional voice stream for lower latency and more natural turn-taking. You're scored exactly the same way.",
    icon: Radio,
  },
];

export function SettingsView({ name, isGuest, liveAvailable }: SettingsViewProps) {
  const active = useConversationMode();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Tune how Echo talks with you. Changes save to this browser instantly.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>Conversation engine</CardTitle>
          <CardDescription>
            How the live turn is produced. Both engines feed the same band scorer.
          </CardDescription>
        </div>

        <div
          role="radiogroup"
          aria-label="Conversation engine"
          className="grid gap-4 sm:grid-cols-2"
        >
          {ENGINES.map((engine) => {
            const selected = active === engine.mode;
            const disabled = engine.mode === "live" && !liveAvailable;
            const Icon = engine.icon;
            return (
              <button
                key={engine.mode}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                onClick={() => setConversationMode(engine.mode)}
                className={cn(
                  "focus-visible:ring-ring focus-visible:ring-offset-background flex flex-col gap-3 rounded-[var(--radius)] border p-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  selected
                    ? "border-primary bg-primary-soft shadow-[var(--glow-primary)]"
                    : "border-border bg-card hover:bg-muted",
                  disabled && "hover:bg-card cursor-not-allowed opacity-60",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {selected && (
                    <span className="text-primary inline-flex items-center gap-1 text-xs font-semibold">
                      <Check className="size-4" aria-hidden /> Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-semibold">
                    {engine.label}
                    {engine.mode === "live" && (
                      <Badge tone="accent" className="px-2 py-0.5 text-[10px]">
                        Beta
                      </Badge>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">
                    {engine.tagline}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm">{engine.description}</p>

                {disabled && (
                  <p className="text-warning text-xs font-medium">
                    Not configured on this deployment yet.
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Switch between light and dark.</CardDescription>
        </div>
        <Card className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold">Dark mode</span>
            <span className="text-muted-foreground text-sm">Easier on the eyes at night.</span>
          </div>
          <ThemeToggle />
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>Account</CardTitle>
          <CardDescription>Who you&apos;re signed in as.</CardDescription>
        </div>
        <Card className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground text-sm">
              {isGuest
                ? "Guest session — progress lives in this browser."
                : "Signed in with Google."}
            </span>
          </div>
          {isGuest && <Badge tone="neutral">Guest</Badge>}
        </Card>
      </section>
    </div>
  );
}
