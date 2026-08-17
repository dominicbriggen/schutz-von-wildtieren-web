import { z } from "zod";
import { CANTON_VALUES, MAX_IMAGES, MAX_IMAGE_BYTES } from "./constants";

// ── Reusable field helpers ──────────────────────────────────────────────
const reqStr = (max = 300) =>
  z.string().trim().min(1, "Pflichtfeld").max(max);

const optStr = (max = 4000) =>
  z.preprocess((v) => {
    if (v == null) return undefined;
    const s = String(v).trim();
    return s === "" ? undefined : s;
  }, z.string().max(max).optional());

const optInt = z.preprocess(
  (v) => {
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  },
  z.number().int().min(0).max(10_000_000).optional()
);

const optDate = z.preprocess(
  (v) => {
    if (v == null || v === "") return undefined;
    return String(v);
  },
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum")
    .optional()
);

const email = z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse").max(300);
const canton = z.enum(CANTON_VALUES as [string, ...string[]]);

// ── Structured sub-records ──────────────────────────────────────────────
export const animalEntrySchema = z.object({
  species: z.string().trim().min(1).max(120),
  count: z.coerce.number().int().min(1).max(100000),
});

export const entanglementEventSchema = z.object({
  species: z.string().trim().min(1).max(120),
  count: z.coerce.number().int().min(1).max(100000),
  outcome: z.enum(["unverletzt", "verletzt", "verendet"]),
});

export const imageRefSchema = z.object({
  path: z.string().min(1).max(300),
  name: z.string().max(300).optional().default(""),
  size: z.number().int().min(0).max(MAX_IMAGE_BYTES * 2),
  type: z.string().max(120).optional().default(""),
});

const imageArray = z.array(imageRefSchema).max(MAX_IMAGES);

// ── Contact block shared by every form ──────────────────────────────────
const contact = {
  organization: reqStr(200),
  first_name: reqStr(120),
  last_name: reqStr(120),
  email,
  phone: optStr(60),
  canton,
  municipality: reqStr(160),
};

// ── WILDSEEK deployment report ──────────────────────────────────────────
export const wildseekSchema = z.object({
  ...contact,
  system_number: optStr(120),
  report_from: optDate,
  report_to: optDate,
  deployment_count: optInt,
  mounting_type: optStr(160),
  mounting_type_other: optStr(200),
  no_rescue: z.boolean().default(false),
  rescued_animals: z.array(animalEntrySchema).max(40).default([]),
  notes: optStr(5000),
  images: imageArray.default([]),
  image_publish_consent: z.boolean().default(false),
});
export type WildseekInput = z.infer<typeof wildseekSchema>;

// ── Fence report (project + comparison share one schema) ────────────────
export const fenceSchema = z.object({
  report_group: z.enum(["project", "comparison"]),
  ...contact,
  // Shared fence core
  fence_height_cm: optInt,
  fence_length_m: optInt,
  livestock_types: optStr(300),
  livestock_count: optInt,
  // Project-only
  installation_date: optDate,
  system_label: optStr(200),
  // Comparison-only
  fence_type: optStr(60),
  fence_type_other: optStr(200),
  fence_color: optStr(60),
  fence_color_other: optStr(200),
  fence_age: optStr(120),
  // Observation window
  observation_from: optDate,
  observation_to: optDate,
  operating_days: optInt,
  // Entanglements
  entanglement_occurred: z.boolean().default(false),
  entanglement_event_count: optInt,
  entanglement_events: z.array(entanglementEventSchema).max(60).default([]),
  // Wolf attacks
  wolf_attack_occurred: z.boolean().default(false),
  wolf_attack_event_count: optInt,
  wolf_injured_livestock: optInt,
  wolf_killed_livestock: optInt,
  wolf_note: optStr(2000),
  // Maintenance (project form)
  maintenance: z.preprocess(
    (v) => (v == null || v === "" ? undefined : v),
    z.enum(["ja", "teilweise", "nein"]).optional()
  ),
  maintenance_note: optStr(2000),
  // Images + consent
  images: imageArray.default([]),
  image_publish_consent: z.boolean().default(false),
});
export type FenceInput = z.infer<typeof fenceSchema>;

// ── Project interest / waiting list ─────────────────────────────────────
export const interestSchema = z.object({
  project_interest: z.enum(["wildseek", "weidezaun", "beide"]),
  organization: optStr(200),
  first_name: reqStr(120),
  last_name: reqStr(120),
  email,
  phone: optStr(60),
  address: optStr(200),
  postal_code: optStr(20),
  city: optStr(160),
  canton,
  wildseek_need: optStr(3000),
  wildseek_area: optStr(200),
  fence_length_m: optInt,
  livestock_types: optStr(300),
  fence_situation: optStr(3000),
  notes: optStr(3000),
});
export type InterestInput = z.infer<typeof interestSchema>;
