import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "./constants";

// Client-side upload helper for the public forms. Images are uploaded straight
// from the browser to the PRIVATE `form-uploads` bucket (bypassing any server
// body-size limit). The bucket enforces the MIME allow-list and 10 MB size
// limit server-side; anonymous users may only insert, never read or list.

export const FORM_UPLOAD_BUCKET = "form-uploads";

export type UploadedImage = {
  path: string;
  name: string;
  size: number;
  type: string;
};

const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

function extensionFor(file: File): string {
  const fromName = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "";
  if (fromName) return fromName.slice(0, 5);
  const byType = Object.entries(EXT_MIME).find(([, m]) => m === file.type);
  return byType ? byType[0] : "img";
}

export function validateImage(file: File): string | null {
  const extOk = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  const typeOk = ACCEPTED_IMAGE_TYPES.includes(file.type) || extOk;
  if (!typeOk) {
    return "Nicht unterstütztes Format. Erlaubt sind JPEG, PNG, WebP und HEIC.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Diese Datei ist zu gross (maximal 10 MB pro Bild).";
  }
  return null;
}

export async function uploadFormImage(
  folder: "wildseek" | "fence",
  file: File
): Promise<UploadedImage> {
  const supabase = createClient();
  const ext = extensionFor(file);
  // Random, unguessable object name — the original filename is kept only as
  // metadata on the report row, never in the storage path.
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  // Some phone cameras report an empty MIME type for HEIC — fall back to the
  // extension so Supabase's MIME check still passes.
  const contentType = file.type || EXT_MIME[ext] || "application/octet-stream";

  const { error } = await supabase.storage
    .from(FORM_UPLOAD_BUCKET)
    .upload(path, file, { upsert: false, contentType, cacheControl: "3600" });

  if (error) throw new Error(error.message);

  return {
    path,
    name: file.name.slice(0, 200),
    size: file.size,
    type: file.type || contentType,
  };
}
