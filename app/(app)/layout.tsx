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
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground focus-visible:ring-ring sr-only z-50 rounded-full px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus-visible:ring-2 focus-visible:outline-none"
      >
        Skip to content
      </a>
      <TopNav name={session.user.name} isGuest={session.user.isGuest} />
      <main id="main-content" className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        {children}
      </main>
    </div>
  );
}
