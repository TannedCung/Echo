import { describe, expect, it } from "vitest";

import { isS3Configured } from "@/lib/storage/s3-client";

describe("Cloudflare R2 / S3 Storage client", () => {
  it("verifies S3/R2 configuration state", () => {
    expect(typeof isS3Configured).toBe("boolean");
  });
});
