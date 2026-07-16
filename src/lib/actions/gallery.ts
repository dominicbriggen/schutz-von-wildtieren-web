"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const gallerySchema = z.object({
  url: z.string().min(1, "Bitte ein Bild hochladen."),
  alt_text: z.string(),
  category: z.string(),
  year: z.string(),
  order_index: z.coerce.number().int(),
});

export type EntryResult = { status: "success" | "error"; message?: string };

function parse(formData: FormData) {
  return gallerySchema.safeParse({
    url: formData.get("url"),
    alt_text: formData.get("alt_text") ?? "",
    category: formData.get("category") ?? "",
    year: formData.get("year") ?? "",
    order_index: formData.get("order_index") || 0,
  });
}

export async function createGalleryImage(formData: FormData): Promise<EntryResult> {
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").insert({
    ...parsed.data,
    alt_text: parsed.data.alt_text || null,
    category: parsed.data.category || null,
    year: parsed.data.year || null,
    status: "published",
  });
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };

  revalidatePath("/admin/bilder");
  revalidatePath("/bilder");
  return { status: "success" };
}

export async function updateGalleryImage(id: string, formData: FormData): Promise<EntryResult> {
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_images")
    .update({
      ...parsed.data,
      alt_text: parsed.data.alt_text || null,
      category: parsed.data.category || null,
      year: parsed.data.year || null,
    })
    .eq("id", id);
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };

  revalidatePath("/admin/bilder");
  revalidatePath("/bilder");
  return { status: "success" };
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createClient();
  await supabase.from("gallery_images").delete().eq("id", id);
  revalidatePath("/admin/bilder");
  revalidatePath("/bilder");
}

export async function toggleGalleryVisibility(id: string, hidden: boolean) {
  const supabase = await createClient();
  await supabase
    .from("gallery_images")
    .update({ status: hidden ? "hidden" : "published" })
    .eq("id", id);
  revalidatePath("/admin/bilder");
  revalidatePath("/bilder");
}
