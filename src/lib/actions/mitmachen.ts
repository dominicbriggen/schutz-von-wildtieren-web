"use server";

import { createClient } from "@/lib/supabase/server";
import {
  wildseekSchema,
  fenceSchema,
  interestSchema,
  imageRefSchema,
} from "@/lib/forms/schemas";
import {
  checkRateLimit,
  isHoneypotTripped,
  isTooFast,
} from "@/lib/forms/anti-spam";
import {
  sendWildseekEmails,
  sendFenceEmails,
  sendInterestEmails,
} from "@/lib/email/notifications";

export type MitmachenFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const SUCCESS: MitmachenFormState = { status: "success" };
const GENERIC_ERROR: MitmachenFormState = {
  status: "error",
  message:
    "Ihre Angaben konnten aus technischen Gründen nicht übermittelt werden. Bitte versuchen Sie es später erneut.",
};

function parseJson(fd: FormData, key: string): unknown {
  try {
    return JSON.parse(String(fd.get(key) ?? "[]"));
  } catch {
    return [];
  }
}

// Honeypot / timing / rate-limit gate shared by every form. Returns a state to
// return early, or null to continue. A tripped honeypot or an impossibly fast
// submit is silently accepted (looks like success to the bot) but never stored.
async function gate(
  form: string,
  fd: FormData
): Promise<MitmachenFormState | null> {
  if (isHoneypotTripped(fd) || isTooFast(fd)) return SUCCESS;
  const allowed = await checkRateLimit(form);
  if (!allowed) {
    return {
      status: "error",
      message:
        "Es wurden in kurzer Zeit zu viele Übermittlungen gesendet. Bitte versuchen Sie es in einigen Minuten erneut.",
    };
  }
  return null;
}

function requireDataConsent(fd: FormData): MitmachenFormState | null {
  if (fd.get("data_consent") !== "on") {
    return {
      status: "error",
      message:
        "Bitte bestätigen Sie, dass Ihre Angaben gemäss unserer Datenschutzerklärung verarbeitet werden dürfen.",
    };
  }
  return null;
}

function cleanImages(raw: unknown, folder: "wildseek" | "fence") {
  const arr = Array.isArray(raw) ? raw : [];
  return arr
    .map((x) => imageRefSchema.safeParse(x))
    .filter((r) => r.success)
    .map((r) => r.data)
    .filter((img) => img.path.startsWith(`${folder}/`))
    .slice(0, 5);
}

// ── WILDSEEK deployment report ──────────────────────────────────────────
export async function submitWildseekReport(
  _prev: MitmachenFormState,
  fd: FormData
): Promise<MitmachenFormState> {
  const gated = await gate("wildseek", fd);
  if (gated) return gated;
  const consent = requireDataConsent(fd);
  if (consent) return consent;

  const noRescue = fd.get("no_rescue") === "on";
  const animalsRaw = parseJson(fd, "rescued_animals");
  const rescued = noRescue
    ? []
    : (Array.isArray(animalsRaw) ? animalsRaw : [])
        .map((a) => ({
          species: String((a as { species?: unknown })?.species ?? "").trim(),
          count: Number((a as { count?: unknown })?.count),
        }))
        .filter((a) => a.species !== "" && Number.isFinite(a.count) && a.count > 0);

  const parsed = wildseekSchema.safeParse({
    organization: fd.get("organization"),
    first_name: fd.get("first_name"),
    last_name: fd.get("last_name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    canton: fd.get("canton"),
    municipality: fd.get("municipality"),
    system_number: fd.get("system_number"),
    report_from: fd.get("report_from"),
    report_to: fd.get("report_to"),
    deployment_count: fd.get("deployment_count"),
    mounting_type: fd.get("mounting_type"),
    mounting_type_other: fd.get("mounting_type_other"),
    no_rescue: noRescue,
    rescued_animals: rescued,
    notes: fd.get("notes"),
    images: cleanImages(parseJson(fd, "images"), "wildseek"),
    image_publish_consent: fd.get("image_publish_consent") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Bitte prüfen Sie Ihre Angaben und ergänzen Sie die Pflichtfelder.",
    };
  }

  const supabase = await createClient();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const { error } = await supabase
    .from("wildseek_reports")
    .insert({ ...parsed.data, id, created_at: createdAt });
  if (error) return GENERIC_ERROR;

  // Storage in the database has priority: a failing e-mail must never lose a
  // correctly submitted report, so notifications run in a swallowed try/catch.
  try {
    await sendWildseekEmails(parsed.data, id, createdAt);
  } catch (e) {
    console.error("[mitmachen] WILDSEEK-Benachrichtigung fehlgeschlagen", e);
  }
  return SUCCESS;
}

// ── Fence report (project + comparison) ─────────────────────────────────
export async function submitFenceReport(
  _prev: MitmachenFormState,
  fd: FormData
): Promise<MitmachenFormState> {
  const gated = await gate("fence", fd);
  if (gated) return gated;
  const consent = requireDataConsent(fd);
  if (consent) return consent;

  const entOccurred = fd.get("entanglement_occurred") === "true";
  const eventsRaw = parseJson(fd, "entanglement_events");
  const events = entOccurred
    ? (Array.isArray(eventsRaw) ? eventsRaw : [])
        .map((e) => ({
          species: String((e as { species?: unknown })?.species ?? "").trim(),
          count: Number((e as { count?: unknown })?.count),
          outcome: String((e as { outcome?: unknown })?.outcome ?? ""),
        }))
        .filter(
          (e) =>
            e.species !== "" &&
            Number.isFinite(e.count) &&
            e.count > 0 &&
            ["unverletzt", "verletzt", "verendet"].includes(e.outcome)
        )
    : [];

  const wolfOccurred = fd.get("wolf_attack_occurred") === "true";

  const parsed = fenceSchema.safeParse({
    report_group: fd.get("report_group"),
    organization: fd.get("organization"),
    first_name: fd.get("first_name"),
    last_name: fd.get("last_name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    canton: fd.get("canton"),
    municipality: fd.get("municipality"),
    fence_height_cm: fd.get("fence_height_cm"),
    fence_length_m: fd.get("fence_length_m"),
    livestock_types: fd.get("livestock_types"),
    livestock_count: fd.get("livestock_count"),
    installation_date: fd.get("installation_date"),
    system_label: fd.get("system_label"),
    fence_type: fd.get("fence_type"),
    fence_type_other: fd.get("fence_type_other"),
    fence_color: fd.get("fence_color"),
    fence_color_other: fd.get("fence_color_other"),
    fence_age: fd.get("fence_age"),
    observation_from: fd.get("observation_from"),
    observation_to: fd.get("observation_to"),
    operating_days: fd.get("operating_days"),
    entanglement_occurred: entOccurred,
    entanglement_event_count: fd.get("entanglement_event_count"),
    entanglement_events: events,
    wolf_attack_occurred: wolfOccurred,
    wolf_attack_event_count: wolfOccurred ? fd.get("wolf_attack_event_count") : "",
    wolf_injured_livestock: wolfOccurred ? fd.get("wolf_injured_livestock") : "",
    wolf_killed_livestock: wolfOccurred ? fd.get("wolf_killed_livestock") : "",
    wolf_note: wolfOccurred ? fd.get("wolf_note") : "",
    maintenance: fd.get("maintenance"),
    maintenance_note: fd.get("maintenance_note"),
    images: cleanImages(parseJson(fd, "images"), "fence"),
    image_publish_consent: fd.get("image_publish_consent") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Bitte prüfen Sie Ihre Angaben und ergänzen Sie die Pflichtfelder.",
    };
  }

  const supabase = await createClient();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const { error } = await supabase
    .from("fence_reports")
    .insert({ ...parsed.data, id, created_at: createdAt });
  if (error) return GENERIC_ERROR;

  try {
    await sendFenceEmails(parsed.data, id, createdAt);
  } catch (e) {
    console.error("[mitmachen] Weidezaun-Benachrichtigung fehlgeschlagen", e);
  }
  return SUCCESS;
}

// ── Project interest / waiting list ─────────────────────────────────────
export async function submitProjectInterest(
  _prev: MitmachenFormState,
  fd: FormData
): Promise<MitmachenFormState> {
  const gated = await gate("interest", fd);
  if (gated) return gated;
  const consent = requireDataConsent(fd);
  if (consent) return consent;

  const parsed = interestSchema.safeParse({
    project_interest: fd.get("project_interest"),
    organization: fd.get("organization"),
    first_name: fd.get("first_name"),
    last_name: fd.get("last_name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    address: fd.get("address"),
    postal_code: fd.get("postal_code"),
    city: fd.get("city"),
    canton: fd.get("canton"),
    wildseek_need: fd.get("wildseek_need"),
    wildseek_area: fd.get("wildseek_area"),
    fence_length_m: fd.get("fence_length_m"),
    livestock_types: fd.get("livestock_types"),
    fence_situation: fd.get("fence_situation"),
    notes: fd.get("notes"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Bitte prüfen Sie Ihre Angaben und ergänzen Sie die Pflichtfelder.",
    };
  }

  const supabase = await createClient();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const { error } = await supabase
    .from("project_interests")
    .insert({ ...parsed.data, id, created_at: createdAt });
  if (error) return GENERIC_ERROR;

  try {
    await sendInterestEmails(parsed.data, id, createdAt);
  } catch (e) {
    console.error("[mitmachen] Interessenten-Benachrichtigung fehlgeschlagen", e);
  }
  return SUCCESS;
}
