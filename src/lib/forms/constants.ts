// Shared, framework-agnostic constants for the /mitmachen forms. Safe to
// import from both Client and Server Components (no server-only code here).

// ── Swiss cantons ───────────────────────────────────────────────────────
// Stored as the official 2-letter abbreviation; displayed with the full name.
export const CANTONS = [
  { value: "AG", label: "Aargau" },
  { value: "AI", label: "Appenzell Innerrhoden" },
  { value: "AR", label: "Appenzell Ausserrhoden" },
  { value: "BE", label: "Bern" },
  { value: "BL", label: "Basel-Landschaft" },
  { value: "BS", label: "Basel-Stadt" },
  { value: "FR", label: "Freiburg" },
  { value: "GE", label: "Genf" },
  { value: "GL", label: "Glarus" },
  { value: "GR", label: "Graubünden" },
  { value: "JU", label: "Jura" },
  { value: "LU", label: "Luzern" },
  { value: "NE", label: "Neuenburg" },
  { value: "NW", label: "Nidwalden" },
  { value: "OW", label: "Obwalden" },
  { value: "SG", label: "St. Gallen" },
  { value: "SH", label: "Schaffhausen" },
  { value: "SO", label: "Solothurn" },
  { value: "SZ", label: "Schwyz" },
  { value: "TG", label: "Thurgau" },
  { value: "TI", label: "Tessin" },
  { value: "UR", label: "Uri" },
  { value: "VD", label: "Waadt" },
  { value: "VS", label: "Wallis" },
  { value: "ZG", label: "Zug" },
  { value: "ZH", label: "Zürich" },
] as const;

export const CANTON_VALUES = CANTONS.map((c) => c.value);

export function cantonLabel(value: string | null | undefined): string {
  if (!value) return "—";
  const found = CANTONS.find((c) => c.value === value);
  return found ? `${found.label} (${found.value})` : value;
}

// ── Fence type / colour (comparison form) ───────────────────────────────
export const FENCE_TYPES = [
  { value: "elektronetz", label: "Elektronetz / Weidenetz" },
  { value: "litzenzaun", label: "Litzenzaun" },
  { value: "drahtzaun", label: "Drahtzaun" },
  { value: "andere", label: "Andere" },
] as const;

export const FENCE_COLORS = [
  { value: "orange", label: "Orange" },
  { value: "gruen", label: "Grün" },
  { value: "blau_weiss", label: "Blau-Weiss" },
  { value: "andere", label: "Andere" },
] as const;

// ── Outcome of an entanglement event ────────────────────────────────────
export const OUTCOMES = [
  { value: "unverletzt", label: "Unverletzt" },
  { value: "verletzt", label: "Verletzt" },
  { value: "verendet", label: "Verendet" },
] as const;

// ── Maintenance answer (project fence form) ─────────────────────────────
export const MAINTENANCE_OPTIONS = [
  { value: "ja", label: "Ja" },
  { value: "teilweise", label: "Teilweise" },
  { value: "nein", label: "Nein" },
] as const;

// ── Project interest choice ─────────────────────────────────────────────
export const PROJECT_INTEREST_OPTIONS = [
  { value: "wildseek", label: "WILDSEEK" },
  { value: "weidezaun", label: "Wildtierschonende Weidezäune" },
  { value: "beide", label: "Beide Projekte" },
] as const;

// ── Admin workflow statuses ─────────────────────────────────────────────
export const SUBMISSION_STATUSES = [
  { value: "neu", label: "Neu" },
  { value: "gesichtet", label: "Gesichtet" },
  { value: "erledigt", label: "Erledigt" },
  { value: "archiviert", label: "Archiviert" },
] as const;

export const INTEREST_STATUSES = [
  { value: "neu", label: "Neu" },
  { value: "kontaktiert", label: "Kontaktiert" },
  { value: "warteliste", label: "Warteliste" },
  { value: "zugesagt", label: "Teilnahme zugesagt" },
  { value: "abgeschlossen", label: "Abgeschlossen" },
  { value: "abgelehnt", label: "Abgelehnt" },
] as const;

// ── Image upload limits (mirrored server-side in the bucket definition) ──
export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
// File extensions accepted by the <input accept="…"> attribute. HEIC/HEIF are
// included because some phone cameras report an empty MIME type for them.
export const ACCEPTED_IMAGE_EXTENSIONS =
  ".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif";

// Small generic label helper for value/label option arrays.
export function optionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined
): string {
  if (!value) return "—";
  return options.find((o) => o.value === value)?.label ?? value;
}
