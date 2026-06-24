import { Mic, Sparkles, Waves } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const loop = [
  {
    icon: Waves,
    title: "Hear it",
    body: "A friendly examiner speaks to you with natural, warm AI speech.",
  },
  {
    icon: Mic,
    title: "Say it",
    body: "Answer out loud. Echo listens in real time and follows your lead.",
  },
  {
    icon: Sparkles,
    title: "Own it",
    body: "Get band-by-band feedback against the official descriptors, then repeat.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <section className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <span className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
          <Sparkles className="text-accent size-4" aria-hidden />
          AI-powered IELTS speaking coach
        </span>

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
          {loop.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border p-6 text-center shadow-sm"
            >
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
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
