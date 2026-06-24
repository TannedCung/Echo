import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { MascotPreview } from "@/components/mascot/mascot-preview";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Speaking practice — Echo" };

const steps = [
  { title: "Hear it", body: "Echo speaks each question in a warm, natural voice." },
  { title: "Say it", body: "You answer out loud; Echo transcribes you live." },
  { title: "Own it", body: "Get band-by-band feedback, then practice again." },
];

export default function SpeakingPracticePage() {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <MascotPreview size="lg" />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Your speaking coach is warming up
          </h1>
          <p className="text-muted-foreground max-w-md">
            The live examiner — microphone, real-time transcript, and band scoring — arrives in the
            next build. Here&apos;s the loop you&apos;ll step through.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="flex flex-col gap-2 text-left">
            <CardTitle className="text-primary text-base">{step.title}</CardTitle>
            <CardDescription>{step.body}</CardDescription>
          </Card>
        ))}
      </div>

      <Button asChild variant="outline">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
