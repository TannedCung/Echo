import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://echo-lovat-rho.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Echo — AI IELTS Speaking Coach | Hear it. Say it. Own it.",
    template: "%s — Echo",
  },
  description:
    "Echo is an AI-powered IELTS speaking coach. A friendly examiner asks real questions, listens as you answer, and scores you against the official band descriptors — practice speaking anytime, without the anxiety.",
  keywords: [
    "IELTS speaking",
    "IELTS practice",
    "AI speaking coach",
    "IELTS band score",
    "English speaking practice",
    "IELTS examiner",
    "speaking test prep",
  ],
  applicationName: "Echo",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Echo",
    title: "Echo — AI IELTS Speaking Coach",
    description:
      "Practice IELTS speaking with a coach that actually listens. Real examiner questions, live feedback, and band scores against the official descriptors.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo — AI IELTS Speaking Coach",
    description:
      "Hear it. Say it. Own it. Practice IELTS speaking with a friendly AI examiner and get band-by-band feedback.",
  },
};

export const viewport: Viewport = { themeColor: "#2F8A88" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <head>
        {/* Apply the saved theme before paint so a dark-mode reload never flashes light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("echo-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
