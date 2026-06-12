"use server";

import { createClient } from "@supabase/supabase-js";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    return { error: "File is too large. Maximum size is 10MB." };
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: "Storage not configured." };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);

  const ext = file.name.split(".").pop() || "jpg";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .slice(0, 40)
    .replace(/^-+|-+$/g, "");

  const filename = `${Date.now()}-${base || "image"}.${ext}`;

  const { data, error } = await supabase.storage
    .from("safari-images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error || !data) {
    return { error: error?.message || "Upload failed." };
  }

  const { data: urlData } = supabase.storage
    .from("safari-images")
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}
