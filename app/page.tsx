import { Mic, Sparkles, Waves } from "lucide-react";
import Link from "next/link";

import { EchoMascot } from "@/components/mascot/echo-mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StatTone } from "@/components/ui/stat";

const loop: {
  icon: typeof Waves;
  title: string;
  body: string;
  tone: StatTone;
}[] = [
  {
    icon: Waves,
    title: "Hear it",
    body: "A friendly examiner speaks to you with natural, warm AI speech.",
    tone: "primary",
  },
  {
    icon: Mic,
    title: "Say it",
    body: "Answer out loud. Echo listens in real time and follows your lead.",
    tone: "accent",
  },
  {
    icon: Sparkles,
    title: "Own it",
    body: "Get band-by-band feedback against the official descriptors, then repeat.",
    tone: "success",
  },
];

const HALO: Record<StatTone, string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <section className="relative flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        {/* Atmospheric glow — Echo's rings, rendered as a calm radial wash. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(40rem 28rem at 50% 18%, var(--primary-soft), transparent 70%)",
          }}
        />

        <EchoMascot state="speaking" size="lg" />

        <Badge tone="accent">
          <Sparkles className="size-3.5" aria-hidden />
          AI-powered IELTS speaking coach
        </Badge>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Meet <span className="text-primary">Echo</span>
          </h1>
          <p className="text-muted-foreground text-2xl font-semibold">Hear it. Say it. Own it.</p>
          <p className="text-muted-foreground max-w-md text-lg text-balance">
            An echo begins by hearing a sound and returning it. Echo helps you turn unfamiliar
            sounds into your own confident voice.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">Start practicing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/practice/speaking">Try a speaking session</Link>
          </Button>
        </div>

        <ul className="mt-8 grid w-full gap-4 sm:grid-cols-3">
          {loop.map(({ icon: Icon, title, body, tone }) => (
            <li
              key={title}
              className="border-border bg-card flex flex-col items-center gap-3 rounded-[var(--radius)] border p-6 text-center shadow-sm"
            >
              <span
                className={`flex size-12 items-center justify-center rounded-full ${HALO[tone]}`}
              >
                <Icon className="size-6" aria-hidden />
              </span>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="text-muted-foreground text-sm">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-border text-muted-foreground w-full border-t py-6 text-center text-sm">
        Echo — practice IELTS speaking with a coach that listens.
      </footer>
    </main>
  );
}
