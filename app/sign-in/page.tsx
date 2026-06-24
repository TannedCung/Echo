"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

import { EchoLogo } from "@/components/brand/echo-logo";
import { EchoMascot } from "@/components/mascot/echo-mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="flex w-full max-w-sm flex-col items-center p-8 text-center">
        <EchoMascot state="idle" size="md" />
        <Link href="/" aria-label="Echo — home" className="mt-4">
          <EchoLogo size={28} />
        </Link>
        <p className="text-muted-foreground mt-1 text-sm">Hear it. Say it. Own it.</p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          >
            Continue with Google
          </Button>
          <Button size="lg" onClick={() => signIn("guest", { redirectTo: "/dashboard" })}>
            Continue as guest
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-xs">
          Guest sessions let you practice right away. Sign in with Google to save your progress.
        </p>
      </Card>
    </main>
  );
}
