import { GoogleGenAI, Modality } from "@google/genai";

import { auth } from "@/auth";
import { env, isLiveConfigured } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Mints a short-lived **ephemeral token** for the Gemini Live API (Mode B).
 *
 * The browser opens the Live WebSocket directly for low latency, but must never
 * see the long-lived API key. Instead it calls this route, which exchanges the
 * server-held key for a single-use token that expires in minutes. The client
 * connects with `token.name`; the raw key stays on the server.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isLiveConfigured) {
    return Response.json({ error: "Live mode is not configured." }, { status: 503 });
  }

  const ai = new GoogleGenAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    httpOptions: { apiVersion: "v1alpha" },
  });

  const now = Date.now();
  try {
    const token = await ai.authTokens.create({
      config: {
        // Single connection, valid briefly: the client must open the session
        // within a minute, and the session itself can run for up to 30.
        uses: 1,
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: env.ECHO_LIVE_MODEL,
          config: { responseModalities: [Modality.AUDIO] },
        },
        httpOptions: { apiVersion: "v1alpha" },
      },
    });

    return Response.json({ token: token.name, model: env.ECHO_LIVE_MODEL });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not start a live session." },
      { status: 502 },
    );
  }
}
