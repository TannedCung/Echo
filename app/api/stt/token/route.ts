import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSttProvider } from "@/lib/stt/registry";

export const runtime = "nodejs";

/**
 * Mints a short-lived STT token so the browser can stream audio directly to the
 * provider without ever seeing the long-lived API key. Auth-gated.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getSttProvider().createEphemeralToken();
    return NextResponse.json(token, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
