import { randomUUID } from "node:crypto";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

/**
 * Echo authentication: Google OAuth for real accounts, plus a guest provider
 * that mints an anonymous session so anyone can try a speaking session with no
 * sign-up. JWT sessions keep auth working without a database.
 *
 * Google is only active when AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET are set; guest
 * mode always works.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      id: "guest",
      name: "Continue as guest",
      credentials: {},
      authorize: async () => ({
        id: `guest_${randomUUID()}`,
        name: "Guest",
        isGuest: true,
      }),
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.isGuest = user.isGuest ?? false;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.isGuest = (token.isGuest as boolean | undefined) ?? false;
      }
      return session;
    },
  },
});
