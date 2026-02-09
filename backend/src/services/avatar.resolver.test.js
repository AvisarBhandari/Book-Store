import { jest } from "@jest/globals";
import fs from "fs";

// ✅ Mock avatar.service BEFORE importing resolver
await jest.unstable_mockModule("./avatar.service.js", () => ({
  generateAvatar: jest.fn(async ({ name, model }) => {
    return `uploads/picture/${model}/avatar-${name}.png`;
  }),
}));

// ✅ Now import AFTER mocks
const { resolveAvatar } = await import("./avatar.resolver.js");
const { generateAvatar } = await import("./avatar.service.js");

// ✅ Mock fs safely
jest.spyOn(fs, "existsSync").mockReturnValue(true);
jest.spyOn(fs, "unlinkSync").mockImplementation(() => {});

describe("resolveAvatar (ESM)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("creates generated avatar on create", async () => {
    const result = await resolveAvatar({
      doc: null,
      file: null,
      name: "John Doe",
      model: "user",
    });

    expect(generateAvatar).toHaveBeenCalledTimes(1);
    expect(result.avatarType).toBe("generated");
    expect(result.ppImage).toContain("John Doe");
  });

  test("uses uploaded file when provided", async () => {
    const result = await resolveAvatar({
      doc: null,
      file: { path: "uploads/user/photo.png" },
      name: "John Doe",
      model: "user",
    });

    expect(generateAvatar).not.toHaveBeenCalled();
    expect(result.avatarType).toBe("uploaded");
    expect(result.ppImage).toBe("uploads/user/photo.png");
  });

  test("does NOT regenerate if name unchanged", async () => {
    const doc = {
      name: "John Doe",
      ppImage: "uploads/avatar.png",
      avatarType: "generated",
      lastAvatarGeneratedAt: new Date(Date.now() - 60_000),
    };

    const result = await resolveAvatar({
      doc,
      file: null,
      name: "John Doe",
      model: "user",
    });

    expect(generateAvatar).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });

  test("regenerates if name changes and cooldown passed", async () => {
    const doc = {
      name: "John Doe",
      ppImage: "uploads/avatar.png",
      avatarType: "generated",
      lastAvatarGeneratedAt: new Date(Date.now() - 60 * 60 * 1000),
    };

    const result = await resolveAvatar({
      doc,
      file: null,
      name: "Jane Doe",
      model: "user",
    });

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(generateAvatar).toHaveBeenCalledTimes(1);
    expect(result.avatarType).toBe("generated");
  });

  test("blocks regeneration during cooldown", async () => {
    const doc = {
      name: "John Doe",
      ppImage: "uploads/avatar.png",
      avatarType: "generated",
      lastAvatarGeneratedAt: new Date(),
    };

    const result = await resolveAvatar({
      doc,
      file: null,
      name: "Jane Doe",
      model: "user",
    });

    expect(generateAvatar).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
