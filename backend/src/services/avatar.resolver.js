import path from "path";
import fs from "fs";
import { generateAvatar } from "./avatar.service.js";

const MODEL_DIR_MAP = {
  user: "uploads/picture/users",
  seller: "uploads/picture/sellers",
  admin: "uploads/picture/admins",
  author: "uploads/picture/authors",
};

const AVATAR_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

export async function resolveAvatar({
  doc, // existing document or null
  file, // multer file or null
  name,
  model,
}) {
  // 1️⃣ Uploaded file always wins
  if (file) {
    return {
      ppImage: file.path,
      avatarType: "uploaded",
      avatarUpdatedAt: new Date(),
    };
  }

  // 2️⃣ No name → no avatar
  if (!name) return {};

  // 3️⃣ Prevent spam regeneration
  if (doc && doc.name === name && doc.avatarType === "generated") {
    return {};
  }

  if (
    doc?.avatarUpdatedAt &&
    Date.now() - new Date(doc.avatarUpdatedAt).getTime() < AVATAR_COOLDOWN_MS
  ) {
    return {};
  }

  // 4️⃣ Resolve model-specific directory
  const baseDir = MODEL_DIR_MAP[model] ?? "uploads/picture/others";

  const ppImage = await generateAvatar({
    name,
    model,
    outputDir: baseDir,
  });

  return {
    ppImage,
    avatarType: "generated",
    avatarUpdatedAt: new Date(),
  };
}
