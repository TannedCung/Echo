import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getListeningTest, transcriptText } from "@/lib/ielts/listening-tests";
import { getTtsProvider } from "@/lib/tts/registry";

export const runtime = "nodejs";

const bodySchema = z.object({ testId: z.string().min(1) });

/**
 * Synthesises a Listening test's script server-side, so the transcript text is
 * never shipped to the browser — the candidate hears the audio but cannot read
 * it while answering. Auth-gated (guests included) to protect the paid provider.
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

  const test = getListeningTest(parsed.data.testId);
  if (!test) {
    return NextResponse.json({ error: "Unknown listening test" }, { status: 404 });
  }

  try {
    const stream = await getTtsProvider().synthesize(transcriptText(test));
    return new Response(stream, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
