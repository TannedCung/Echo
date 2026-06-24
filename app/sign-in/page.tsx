"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-card w-full max-w-sm rounded-2xl border p-8 text-center shadow-sm">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-primary">Echo</span>
        </Link>
        <p className="text-muted-foreground mt-1 text-sm">Hear it. Say it. Own it.</p>

        <div className="mt-8 flex flex-col gap-3">
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
      </div>
    </main>
  );
}
