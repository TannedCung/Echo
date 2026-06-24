import {
  ArrowRight,
  Gauge,
  HeartHandshake,
  MessageCircle,
  Mic,
  Play,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react";
import Link from "next/link";

import { EchoLogo } from "@/components/brand/echo-logo";
import { EchoMascot } from "@/components/mascot/echo-mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://echo-lovat-rho.vercel.app";

/** Schema.org SoftwareApplication record so search engines render a rich result. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Echo",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  description:
    "AI-powered IELTS speaking coach. A friendly examiner asks real questions, listens, and scores you against the official band descriptors.",
  url: SITE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1280" },
};

const LOOP = [
  {
    icon: Waves,
    title: "Hear it",
    body: "A warm AI examiner speaks naturally — the same Part 1, 2 and 3 questions you'll meet on test day.",
  },
  {
    icon: Mic,
    title: "Say it",
    body: "Answer out loud. Echo transcribes in real time and follows up like a real examiner would.",
  },
  {
    icon: Sparkles,
    title: "Own it",
    body: "Get band-by-band feedback on fluency, vocabulary, grammar and pronunciation — then go again.",
  },
];

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Real examiner conversations",
    body: "Natural turn-taking across all three speaking parts — not a quiz, a conversation.",
  },
  {
    icon: Gauge,
    title: "Official band descriptors",
    body: "Scored on fluency, lexical resource, grammar and pronunciation, the way real examiners grade.",
  },
  {
    icon: HeartHandshake,
    title: "Built to lower anxiety",
    body: "A friendly companion, gentle pacing and encouraging feedback — never a cold grade.",
  },
  {
    icon: TrendingUp,
    title: "Track every session",
    body: "See your band trend over time and revisit past answers to hear yourself improve.",
  },
];

const SAMPLE_CRITERIA = [
  { label: "Fluency & Coherence", band: 7, note: "Smooth and easy to follow" },
  { label: "Lexical Resource", band: 6, note: "Reach for a few more topic-specific words" },
  { label: "Grammatical Range", band: 6.5, note: "Good control of complex forms" },
  { label: "Pronunciation", band: 7, note: "Clear and well-paced" },
];

/** Decorative concentric "echo" rings behind the hero. */
function Rings() {
  const rings = [0.3, 0.5, 0.7, 0.9, 1.1];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="pointer-events-none absolute -top-40 left-1/2 -z-0 size-[760px] -translate-x-1/2 opacity-55"
    >
      {rings.map((r, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r * 44}
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="0.16"
          opacity={0.5 - i * 0.08}
        />
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-5xl items-center justify-between px-6 py-3">
          <EchoLogo size={28} />
          <nav className="flex items-center gap-6">
            <a
              href="#how"
              className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition-colors sm:inline"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition-colors sm:inline"
            >
              Features
            </a>
            <Button asChild size="sm">
              <Link href="/sign-in">Start free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden text-center">
        <Rings />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 pt-22 pb-18">
          <Badge tone="accent">
            <Sparkles className="size-3.5" aria-hidden /> AI-powered IELTS speaking coach
          </Badge>
          <EchoMascot state="speaking" size="lg" />
          <h1 className="text-5xl font-extrabold tracking-tight text-balance sm:text-6xl">
            Speak IELTS with confidence
          </h1>
          <p className="text-muted-foreground max-w-xl text-xl leading-relaxed text-balance">
            Echo is a friendly examiner that asks real questions, listens as you answer, and scores
            you against the official band descriptors — so test day feels like just another
            practice.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-in">
                Start practicing free <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how">
                <Play className="size-4" aria-hidden /> See how it works
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            No card needed · Practice as a guest in seconds
          </p>
        </div>
      </section>

      {/* The loop */}
      <section id="how" className="mx-auto w-full max-w-5xl px-6 pt-6 pb-18">
        <div className="mb-10 flex flex-col items-center gap-2.5 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">Hear it. Say it. Own it.</h2>
          <p className="text-muted-foreground max-w-md text-lg">
            An echo returns the sound it hears. Echo helps you turn unfamiliar sounds into your own
            confident voice.
          </p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-3">
          {LOOP.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <Card className="flex h-full flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <span className="bg-primary-soft text-primary flex size-13 items-center justify-center rounded-full">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span className="text-border text-4xl font-extrabold">{i + 1}</span>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-[0.95rem]">{body}</CardDescription>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* Features + sample band score */}
      <section id="features" className="border-border bg-muted border-y">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 py-18 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h2 className="text-4xl font-extrabold tracking-tight text-balance">
              Everything you need to practice — without the pressure
            </h2>
            <div className="flex flex-col gap-4.5">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <span className="bg-card text-primary flex size-10 flex-none items-center justify-center rounded-xl shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <div className="font-bold">{title}</div>
                    <div className="text-muted-foreground text-sm leading-relaxed">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SampleBandScore />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-22 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <EchoMascot state="idle" size="md" />
          <h2 className="text-4xl font-extrabold tracking-tight text-balance">
            Your next practice session is one tap away
          </h2>
          <p className="text-muted-foreground text-lg">Hear it. Say it. Own it — starting today.</p>
          <Button asChild size="lg">
            <Link href="/sign-in">
              Start practicing free <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border bg-card border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-10">
          <EchoLogo size={24} tone="mono" className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            © 2026 Echo · Practice IELTS speaking with a coach that listens.
          </span>
        </div>
      </footer>
    </main>
  );
}

/** A static, illustrative band report for the marketing features section. */
function SampleBandScore() {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="bg-primary text-primary-foreground flex size-20 flex-none flex-col items-center justify-center rounded-full shadow-[var(--glow-primary)]">
          <span className="text-2xl leading-none font-extrabold">6.5</span>
          <span className="text-[0.6rem] font-medium opacity-90">overall</span>
        </span>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Lovely, natural delivery — a little more range in your linking words will push you higher
          next time.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {SAMPLE_CRITERIA.map((c) => (
          <div key={c.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold">{c.label}</span>
              <span className="text-primary text-sm font-bold tabular-nums">
                {c.band.toFixed(1)}
              </span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${(c.band / 9) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs">{c.note}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
