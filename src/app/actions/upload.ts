"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function uploadImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Use JPG, PNG, WEBP, GIF or AVIF." };
  }

  if (file.size > MAX_SIZE) {
    return { error: "File is too large. Maximum size is 8MB." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .slice(0, 40)
    .replace(/^-+|-+$/g, "");

  const filename = `${Date.now()}-${base || "image"}${ext}`;
  await writeFile(path.join(uploadDir, filename), buffer);

  return { url: `/images/uploads/${filename}` };
}
