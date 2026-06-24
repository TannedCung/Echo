"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/db/client";
import { saveOnboarding } from "@/lib/db/queries/users";
import { BAND_STEPS } from "@/lib/ielts/band-descriptors";

const onboardingSchema = z.object({
  goalBand: z.coerce.number(),
  testDate: z.string().trim().optional(),
});

export async function saveOnboardingAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const parsed = onboardingSchema.safeParse({
    goalBand: formData.get("goalBand"),
    testDate: formData.get("testDate"),
  });

  if (!parsed.success || !(BAND_STEPS as readonly number[]).includes(parsed.data.goalBand)) {
    redirect("/onboarding?error=invalid");
  }

  const parsedDate = parsed.data.testDate ? new Date(parsed.data.testDate) : null;
  const testDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;

  if (isDbConfigured) {
    await saveOnboarding({
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      isGuest: session.user.isGuest ?? false,
      goalBand: parsed.data.goalBand,
      testDate,
    });
  }

  redirect("/dashboard");
}
