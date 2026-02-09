import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import { getInitials } from "../utils/initial.js";

export const generateAvatar = async ({
  name,
  model = "user",
  size = 256,
  outputDir,
}) => {
  if (!name) {
    throw new Error("Name is required to generate avatar");
  }

  if (!outputDir) {
    throw new Error("outputDir is required");
  }

  const initials = getInitials(name);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  const colors = [
    "#6366F1",
    "#22C55E",
    "#F97316",
    "#EF4444",
    "#0EA5E9",
    "#8B5CF6",
  ];

  const bgColor = colors[name.length % colors.length];

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${size / 2.5}px Sans`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, size / 2, size / 2);

  // Ensure directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  const filename = `avatar-${Date.now()}.png`;
  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

  return filePath;
};
