"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const entrySchema = z.object({
  project_slug: z.string(),
  title: z.string().min(1, "Bitte einen Titel angeben."),
  period_label: z.string(),
  value_label: z.string().min(1, "Bitte einen Ergebnis-Text angeben."),
  order_index: z.coerce.number().int(),
});

export type EntryResult = { status: "success" | "error"; message?: string };

function parse(formData: FormData) {
  return entrySchema.safeParse({
    project_slug: formData.get("project_slug") ?? "",
    title: formData.get("title"),
    period_label: formData.get("period_label") ?? "",
    value_label: formData.get("value_label"),
    order_index: formData.get("order_index") || 0,
  });
}

export async function createSuccessEntry(formData: FormData): Promise<EntryResult> {
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("success_entries").insert({
    ...parsed.data,
    project_slug: parsed.data.project_slug || null,
    period_label: parsed.data.period_label || null,
    status: "published",
  });
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };

  revalidatePath("/admin/erfolge");
  revalidatePath("/erfolge");
  revalidatePath("/projekte");
  revalidatePath("/");
  return { status: "success" };
}

export async function updateSuccessEntry(id: string, formData: FormData): Promise<EntryResult> {
  const parsed = parse(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("success_entries")
    .update({
      ...parsed.data,
      project_slug: parsed.data.project_slug || null,
      period_label: parsed.data.period_label || null,
    })
    .eq("id", id);
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };

  revalidatePath("/admin/erfolge");
  revalidatePath("/erfolge");
  revalidatePath("/projekte");
  revalidatePath("/");
  return { status: "success" };
}

export async function deleteSuccessEntry(id: string) {
  const supabase = await createClient();
  await supabase.from("success_entries").delete().eq("id", id);
  revalidatePath("/admin/erfolge");
  revalidatePath("/erfolge");
  revalidatePath("/");
}

export async function toggleSuccessEntryVisibility(id: string, hidden: boolean) {
  const supabase = await createClient();
  await supabase
    .from("success_entries")
    .update({ status: hidden ? "hidden" : "published" })
    .eq("id", id);
  revalidatePath("/admin/erfolge");
  revalidatePath("/erfolge");
  revalidatePath("/");
}
