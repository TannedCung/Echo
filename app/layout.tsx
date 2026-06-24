import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Echo — Hear it. Say it. Own it.",
  description:
    "Echo is an AI-powered IELTS speaking coach. Practice with a friendly examiner that listens, replies, and scores you against the official band descriptors.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
