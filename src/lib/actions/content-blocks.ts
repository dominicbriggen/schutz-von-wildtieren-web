"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function saveBlock(key: string, data: unknown) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_blocks")
    .update({ data })
    .eq("key", key);
  return error;
}

const heroImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string(),
  credit: z.string().optional(),
});

const homeHeroSchema = z.object({
  headline: z.string().min(1, "Bitte eine Hauptaussage angeben."),
  subline: z.string(),
  quote: z.string(),
  intro_title: z.string().min(1),
  intro_text: z.string().min(1),
  hero_images: z.array(heroImageSchema),
  primary_cta_label: z.string().min(1),
  primary_cta_href: z.string().min(1),
  secondary_cta_label: z.string().min(1),
  secondary_cta_href: z.string().min(1),
});

export async function updateHomeHero(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  let hero_images: unknown = [];
  try {
    hero_images = JSON.parse((formData.get("hero_images") as string) || "[]");
  } catch {
    return { status: "error", message: "Ungültige Bilddaten." };
  }

  const parsed = homeHeroSchema.safeParse({
    headline: formData.get("headline"),
    subline: formData.get("subline"),
    quote: formData.get("quote"),
    intro_title: formData.get("intro_title"),
    intro_text: formData.get("intro_text"),
    hero_images,
    primary_cta_label: formData.get("primary_cta_label"),
    primary_cta_href: formData.get("primary_cta_href"),
    secondary_cta_label: formData.get("secondary_cta_label"),
    secondary_cta_href: formData.get("secondary_cta_href"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const error = await saveBlock("home_hero", parsed.data);
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };
  revalidatePath("/");
  return { status: "success", message: "Startseite gespeichert." };
}

const helperSchema = z.object({
  name: z.string().min(1),
  role: z.string(),
  bio: z.string(),
  photo_url: z.string().nullable(),
});

const vereinSchema = z.object({
  founder_name: z.string().min(1),
  founder_role: z.string(),
  founder_bio: z.string(),
  founder_photo_url: z.string().nullable(),
  founder_photo_note: z.string().nullable(),
  helpers: z.array(helperSchema),
  goals_title: z.string(),
  goals_text: z.string(),
});

export async function updateVerein(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  let helpers: unknown;
  try {
    helpers = JSON.parse((formData.get("helpers") as string) || "[]");
  } catch {
    return { status: "error", message: "Ungültige Team-Daten." };
  }

  const parsed = vereinSchema.safeParse({
    founder_name: formData.get("founder_name"),
    founder_role: formData.get("founder_role"),
    founder_bio: formData.get("founder_bio"),
    founder_photo_url: (formData.get("founder_photo_url") as string) || null,
    founder_photo_note: (formData.get("founder_photo_note") as string) || null,
    helpers,
    goals_title: formData.get("goals_title"),
    goals_text: formData.get("goals_text"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const error = await saveBlock("verein", parsed.data);
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };
  revalidatePath("/verein");
  revalidatePath("/impressum");
  return { status: "success", message: "Verein gespeichert." };
}

const kontaktSchema = z.object({
  name: z.string().min(1),
  strasse: z.string().min(1),
  ort: z.string().min(1),
  telefon: z.string().nullable(),
  email: z.string().email("Bitte eine gültige E-Mail-Adresse angeben."),
  instagram_url: z.string().nullable(),
  instagram_note: z.string().nullable(),
});

export async function updateKontakt(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = kontaktSchema.safeParse({
    name: formData.get("name"),
    strasse: formData.get("strasse"),
    ort: formData.get("ort"),
    telefon: (formData.get("telefon") as string) || null,
    email: formData.get("email"),
    instagram_url: (formData.get("instagram_url") as string) || null,
    instagram_note: (formData.get("instagram_note") as string) || null,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const error = await saveBlock("kontakt", parsed.data);
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };
  revalidatePath("/kontakt");
  revalidatePath("/");
  revalidatePath("/impressum");
  revalidatePath("/datenschutz");
  return { status: "success", message: "Kontaktangaben gespeichert." };
}

const spendenSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  amounts: z.array(z.number()),
  online_payment_ready: z.boolean(),
  placeholder_note: z.string(),
  hero_image_url: z.string().nullable(),
});

export async function updateSpenden(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const amountsRaw = String(formData.get("amounts") ?? "");
  const amounts = amountsRaw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

  const parsed = spendenSchema.safeParse({
    title: formData.get("title"),
    text: formData.get("text"),
    amounts,
    online_payment_ready: formData.get("online_payment_ready") === "on",
    placeholder_note: formData.get("placeholder_note"),
    hero_image_url: (formData.get("hero_image_url") as string) || null,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }
  const error = await saveBlock("spenden", parsed.data);
  if (error) return { status: "error", message: "Speichern fehlgeschlagen." };
  revalidatePath("/unterstuetzen");
  return { status: "success", message: "Spenden-Seite gespeichert." };
}
