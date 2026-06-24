import { randomUUID } from "node:crypto";

import { get, put } from "@vercel/blob";

import { auth } from "@/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Map a recorder MIME type to a sensible file extension for the stored blob. */
function extFor(contentType: string): string {
  if (contentType.includes("mp4") || contentType.includes("mpeg")) return "mp4";
  if (contentType.includes("ogg")) return "ogg";
  if (contentType.includes("wav")) return "wav";
  return "webm";
}

/** The blob path namespaces audio by owner so access can be checked by prefix. */
function ownerPrefix(userId: string): string {
  return `answers/${userId}/`;
}

/**
 * Stores a candidate's answer audio in Vercel Blob (private store) and returns
 * its pathname, which the client attaches to the turn so the report can offer
 * "listen back" via the GET proxy below. Best-effort: if Blob isn't configured
 * the route returns `{ url: null }` and the session proceeds without audio.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ url: null });
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength === 0) {
    return Response.json({ error: "Empty audio" }, { status: 400 });
  }

  const contentType = request.headers.get("content-type") || "audio/webm";
  try {
    const blob = await put(
      `${ownerPrefix(session.user.id)}${randomUUID()}.${extFor(contentType)}`,
      buffer,
      {
        access: "private",
        contentType,
        token: env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
      },
    );
    // Store the pathname; reads go through the ownership-checked GET proxy.
    return Response.json({ url: blob.pathname });
  } catch (error) {
    console.error("Audio upload failed:", error);
    return Response.json({ url: null });
  }
}

/**
 * Streams a stored answer clip back to its owner. The blob lives in a private
 * store, so it can't be linked directly; this proxy authenticates the request
 * and verifies the path belongs to the caller before streaming the bytes.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!env.BLOB_READ_WRITE_TOKEN) {
    return new Response("Not found", { status: 404 });
  }

  const path = new URL(request.url).searchParams.get("p");
  if (!path || !path.startsWith(ownerPrefix(session.user.id))) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const result = await get(path, { access: "private", token: env.BLOB_READ_WRITE_TOKEN });
    if (!result?.stream) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "audio/webm",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Audio fetch failed:", error);
    return new Response("Not found", { status: 404 });
  }
}
