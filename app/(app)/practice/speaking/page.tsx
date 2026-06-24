import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { EchoVoiceSample } from "@/components/practice/echo-voice-sample";
import { MicCheck } from "@/components/practice/mic-check";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Speaking practice — Echo" };

export default function SpeakingPracticePage() {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Let&apos;s warm up</h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          Hear Echo&apos;s voice and check your microphone. The full examiner conversation and band
          scoring arrive next.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        <Card className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-primary text-base">Hear it</CardTitle>
            <CardDescription>Echo speaks in a warm, natural voice.</CardDescription>
          </div>
          <EchoVoiceSample />
        </Card>

        <Card className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-primary text-base">Say it</CardTitle>
            <CardDescription>Record a few words and see your mic working.</CardDescription>
          </div>
          <MicCheck />
        </Card>
      </div>

      <Button asChild variant="outline">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
