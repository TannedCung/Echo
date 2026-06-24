import { auth } from "@/auth";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EchoMascot } from "@/components/mascot/echo-mascot";
import { isDbConfigured } from "@/lib/db/client";
import { getUserById } from "@/lib/db/queries/users";

import { saveOnboardingAction } from "./actions";

export const metadata = { title: "Set your goal — Echo" };

const GOAL_BANDS = [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const { error } = await searchParams;

  // Pre-fill if they've onboarded before.
  let currentGoal: number | null = null;
  if (isDbConfigured && session?.user?.id) {
    try {
      currentGoal = (await getUserById(session.user.id))?.goalBand ?? null;
    } catch {
      currentGoal = null;
    }
  }
  const selectedGoal = currentGoal ?? 7;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <EchoMascot state="speaking" size="md" />
        <h1 className="text-3xl font-extrabold tracking-tight">What are you aiming for?</h1>
        <p className="text-muted-foreground">
          This helps Echo tailor feedback. You can change it anytime.
        </p>
      </div>

      <Card className="w-full">
        <form action={saveOnboardingAction} className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-semibold">
              <CardTitle className="text-base">Goal band</CardTitle>
            </legend>
            <div className="grid grid-cols-4 gap-2">
              {GOAL_BANDS.map((band) => (
                <label key={band} className="cursor-pointer">
                  <input
                    type="radio"
                    name="goalBand"
                    value={band}
                    defaultChecked={band === selectedGoal}
                    className="peer sr-only"
                  />
                  <span className="border-border bg-card hover:bg-muted peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-ring peer-focus-visible:ring-offset-background flex items-center justify-center rounded-xl border py-3 text-sm font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
                    {band}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="testDate" className="text-sm font-semibold">
              Test date <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input id="testDate" name="testDate" type="date" min={today} />
            <CardDescription>Know when you sit the exam? We&apos;ll help you pace.</CardDescription>
          </div>

          {error && (
            <p className="text-destructive text-sm" role="alert">
              Something looked off — please pick a band and try again.
            </p>
          )}

          <Button type="submit" size="lg">
            Save and start practicing
          </Button>
        </form>
      </Card>
    </div>
  );
}
