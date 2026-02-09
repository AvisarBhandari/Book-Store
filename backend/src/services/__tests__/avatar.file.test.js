import fs from "fs";
import path from "path";
import os from "os";
import { resolveAvatar } from "../avatar.resolver.js";

describe("Avatar resolver outputDir by model", () => {
  it("stores user avatar in users directory", async () => {
    const result = await resolveAvatar({
      doc: null,
      file: null,
      name: "User One",
      model: "user",
    });

    expect(result.ppImage).toContain(path.join("uploads", "picture", "users"));

    expect(fs.existsSync(result.ppImage)).toBe(true);
  });

  it("stores seller avatar in sellers directory", async () => {
    const result = await resolveAvatar({
      doc: null,
      file: null,
      name: "Seller One",
      model: "seller",
    });

    expect(result.ppImage).toContain(
      path.join("uploads", "picture", "sellers"),
    );

    expect(fs.existsSync(result.ppImage)).toBe(true);
  });
});
