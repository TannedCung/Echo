import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { TopNav } from "@/components/shared/top-nav";

/**
 * Authenticated shell. Guests and Google users both have a session here; anyone
 * without one is sent to sign-in. (NextAuth JWT sessions, so no DB round-trip.)
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-full flex-col">
      <TopNav name={session.user.name} isGuest={session.user.isGuest} />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">{children}</div>
    </div>
  );
}
