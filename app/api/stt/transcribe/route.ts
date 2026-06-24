import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSttProvider } from "@/lib/stt/registry";

export const runtime = "nodejs";

/**
 * One-shot transcription of a complete audio clip (used by the mic check and as
 * a fallback for the chained pipeline). The realtime path uses an ephemeral
 * token instead (see /api/stt/token).
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = getSttProvider();
  if (!provider.transcribe) {
    return NextResponse.json(
      { error: `Provider "${provider.name}" has no one-shot transcription` },
      { status: 501 },
    );
  }

  const audio = await request.arrayBuffer();
  if (audio.byteLength === 0) {
    return NextResponse.json({ error: "Empty audio" }, { status: 400 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "audio/webm";
    const result = await provider.transcribe(audio, contentType);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
