"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const newsSchema = z.object({
  slug: z.string().regex(slugRegex, "Der Link-Name darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."),
  title: z.string().min(1, "Bitte einen Titel angeben."),
  summary: z.string(),
  body: z.string(),
  status: z.enum(["draft", "published", "hidden"]),
  cover_image_url: z.string().nullable(),
  order_index: z.coerce.number().int(),
  date_label: z.string(),
});

function parseNewsForm(formData: FormData) {
  return newsSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    status: formData.get("status"),
    cover_image_url: (formData.get("cover_image_url") as string) || null,
    order_index: formData.get("order_index") || 0,
    date_label: formData.get("date_label") ?? "",
  });
}

export async function createNews(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseNewsForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const insertData = {
    ...parsed.data,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };
  const { error } = await supabase.from("news").insert(insertData);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Dieser Link-Name wird bereits verwendet." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/aktuelles");
  revalidatePath("/");
  redirect("/admin/neuigkeiten");
}

export async function updateNews(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseNewsForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("news")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const published_at =
    parsed.data.status === "published"
      ? existing?.published_at ?? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await supabase
    .from("news")
    .update({ ...parsed.data, published_at })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Dieser Link-Name wird bereits verwendet." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/aktuelles");
  revalidatePath(`/aktuelles/${parsed.data.slug}`);
  revalidatePath("/");
  return { status: "success", message: "Neuigkeit gespeichert." };
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  await supabase.from("news").delete().eq("id", id);
  revalidatePath("/admin/neuigkeiten");
  revalidatePath("/aktuelles");
  revalidatePath("/");
}

export async function setNewsStatus(id: string, status: "draft" | "published" | "hidden") {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("news")
    .select("published_at")
    .eq("id", id)
    .single();
  const published_at =
    status === "published" ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null;
  await supabase.from("news").update({ status, published_at }).eq("id", id);
  revalidatePath("/admin/neuigkeiten");
  revalidatePath("/aktuelles");
  revalidatePath("/");
}
