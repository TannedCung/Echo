// @vitest-environment node
// Registries read server-only env (lib/env), so run this suite in Node, not jsdom.
import { describe, expect, it } from "vitest";

import { getSttProvider } from "@/lib/stt/registry";
import { getTtsProvider } from "@/lib/tts/registry";

describe("provider registries", () => {
  it("resolves the default STT provider (deepgram)", () => {
    expect(getSttProvider().name).toBe("deepgram");
  });

  it("resolves the default TTS provider (elevenlabs)", () => {
    expect(getTtsProvider().name).toBe("elevenlabs");
  });

  it("throws a helpful error for unknown providers", () => {
    expect(() => getSttProvider("nope")).toThrow(/Unknown STT provider/);
    expect(() => getTtsProvider("nope")).toThrow(/Unknown TTS provider/);
  });
});
