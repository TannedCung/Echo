import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getTtsProvider } from "@/lib/tts/registry";

export const runtime = "nodejs";

const bodySchema = z.object({
  text: z.string().min(1).max(5000),
  voiceId: z.string().optional(),
});

/**
 * Proxies text-to-speech so the TTS key never reaches the browser. Streams audio
 * straight back to the caller for low-latency playback. Auth-gated (guests have
 * a session too) to avoid anonymous abuse of the paid provider.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const stream = await getTtsProvider().synthesize(parsed.data.text, {
      voiceId: parsed.data.voiceId,
    });
    return new Response(stream, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
