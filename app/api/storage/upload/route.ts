import { auth } from "@/auth";
import { isS3Configured, uploadToS3 } from "@/lib/storage/s3-client";

export const runtime = "nodejs";

/**
 * Upload an image or media asset to Cloudflare R2 S3 storage.
 * Accepts multipart/form-data with a `file` field or raw binary body.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isS3Configured) {
    return Response.json({ error: "Cloudflare R2 storage is not configured" }, { status: 503 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let buffer: Buffer;
    let fileExtension = "png";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return Response.json({ error: "Missing file field in form data" }, { status: 400 });
      }
      buffer = Buffer.from(await file.arrayBuffer());
      fileExtension = file.name.split(".").pop() || "png";
    } else {
      const arrayBuffer = await request.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      if (contentType.includes("image/jpeg")) fileExtension = "jpg";
      else if (contentType.includes("image/webp")) fileExtension = "webp";
      else if (contentType.includes("image/svg+xml")) fileExtension = "svg";
    }

    const key = `exam-assets/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;
    const publicUrl = await uploadToS3(key, buffer, contentType || "image/png");

    return Response.json({ url: publicUrl, key });
  } catch (error) {
    console.error("Storage upload error:", error);
    return Response.json({ error: `Upload failed: ${(error as Error).message}` }, { status: 500 });
  }
}
