"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(200),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  message: z.string().trim().min(10, "Ihre Nachricht ist noch sehr kurz.").max(5000),
  // Honeypot: real visitors never fill this hidden field.
  website: z.string().max(0).optional(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Bitte prüfen Sie Ihre Angaben.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return {
      status: "error",
      message: "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
    };
  }

  return { status: "success", message: "Vielen Dank für Ihre Nachricht! Wir melden uns bei Ihnen." };
}
