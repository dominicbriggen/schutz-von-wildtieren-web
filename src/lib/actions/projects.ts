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

const projectSchema = z.object({
  slug: z.string().regex(slugRegex, "Der Link-Name darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten."),
  title: z.string().min(1, "Bitte einen Titel angeben."),
  summary: z.string(),
  body: z.string(),
  status: z.enum(["draft", "published", "hidden"]),
  cover_image_url: z.string().nullable(),
  images: z.array(z.string()),
  results: z.string(),
  order_index: z.coerce.number().int(),
  date_label: z.string(),
});

function parseProjectForm(formData: FormData) {
  let images: unknown = [];
  try {
    images = JSON.parse((formData.get("images") as string) || "[]");
  } catch {
    images = [];
  }

  return projectSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    status: formData.get("status"),
    cover_image_url: (formData.get("cover_image_url") as string) || null,
    images,
    results: formData.get("results") ?? "",
    order_index: formData.get("order_index") || 0,
    date_label: formData.get("date_label") ?? "",
  });
}

export async function createProject(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const insertData = {
    ...parsed.data,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };
  const { error } = await supabase.from("projects").insert(insertData);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Dieser Link-Name wird bereits verwendet." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/projekte");
  revalidatePath("/");
  redirect("/admin/projekte");
}

export async function updateProject(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("projects")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const published_at =
    parsed.data.status === "published"
      ? existing?.published_at ?? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.data, published_at })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Dieser Link-Name wird bereits verwendet." : "Speichern fehlgeschlagen.",
    };
  }

  revalidatePath("/projekte");
  revalidatePath(`/projekte/${parsed.data.slug}`);
  revalidatePath("/");
  return { status: "success", message: "Projekt gespeichert." };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/admin/projekte");
  revalidatePath("/projekte");
  revalidatePath("/");
}

export async function setProjectStatus(id: string, status: "draft" | "published" | "hidden") {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("projects")
    .select("published_at")
    .eq("id", id)
    .single();
  const published_at =
    status === "published" ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null;
  await supabase.from("projects").update({ status, published_at }).eq("id", id);
  revalidatePath("/admin/projekte");
  revalidatePath("/projekte");
  revalidatePath("/");
}
