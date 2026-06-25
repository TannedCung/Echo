import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SettingsView } from "@/components/settings/settings-view";
import { isLiveConfigured } from "@/lib/env";

export const metadata = { title: "Settings — Echo" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const isGuest = session.user.isGuest ?? false;
  const name = isGuest ? "Guest" : (session.user.name ?? "You");

  return <SettingsView name={name} isGuest={isGuest} liveAvailable={isLiveConfigured} />;
}
