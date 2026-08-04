import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 (S3-compatible) storage client helper.
 * Uses S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET.
 */
let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client | null {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3ClientInstance;
}

/** Check if S3 / Cloudflare R2 is configured. */
export const isS3Configured = Boolean(
  process.env.S3_ENDPOINT &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_BUCKET,
);

/**
 * Upload a file/buffer to Cloudflare R2 S3 storage.
 * Returns the public access URL of the uploaded object.
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array | Blob,
  contentType: string,
): Promise<string> {
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET || "echo";

  if (!client) {
    throw new Error("Cloudflare R2 / S3 storage is not configured.");
  }

  const cleanKey = key.replace(/^\/+/, "");
  const buffer = body instanceof Blob ? Buffer.from(await body.arrayBuffer()) : body;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  if (process.env.S3_PUBLIC_URL) {
    const baseUrl = process.env.S3_PUBLIC_URL.replace(/\/+$/, "");
    return `${baseUrl}/${cleanKey}`;
  }

  // Fallback to S3 endpoint path
  const endpoint = process.env.S3_ENDPOINT!.replace(/\/+$/, "");
  return `${endpoint}/${bucket}/${cleanKey}`;
}
