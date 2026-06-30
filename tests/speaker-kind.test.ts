import { describe, expect, it } from "vitest";

import { resolveSpeakerKind, SPEAKER_KINDS } from "@/lib/speaker/speaker-kind";

describe("resolveSpeakerKind", () => {
  it("selects the avatar only when explicitly requested", () => {
    expect(resolveSpeakerKind("avatar")).toBe("avatar");
  });

  it("defaults to the mascot for unset or unknown values", () => {
    expect(resolveSpeakerKind()).toBe("mascot");
    expect(resolveSpeakerKind(null)).toBe("mascot");
    expect(resolveSpeakerKind("")).toBe("mascot");
    expect(resolveSpeakerKind("nope")).toBe("mascot");
  });

  it("every resolved kind is a known speaker", () => {
    for (const raw of ["mascot", "avatar", "", null, undefined, "weird"]) {
      expect(SPEAKER_KINDS).toContain(resolveSpeakerKind(raw));
    }
  });
});
