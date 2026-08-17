import { requireAdmin } from "@/lib/auth-guard";
import { toCsv, csvResponse } from "@/lib/forms/csv";
import {
  cantonLabel,
  optionLabel,
  PROJECT_INTEREST_OPTIONS,
  INTEREST_STATUSES,
} from "@/lib/forms/constants";
import { fmtDateTime } from "@/lib/forms/format";
import type { ProjectInterest } from "@/lib/forms/types";

export async function GET(request: Request) {
  const { supabase } = await requireAdmin();
  const params = new URL(request.url).searchParams;

  let query = supabase
    .from("project_interests")
    .select("*")
    .order("created_at", { ascending: false });
  const status = params.get("status");
  const project = params.get("project");
  const canton = params.get("canton");
  const from = params.get("from");
  const to = params.get("to");
  if (status) query = query.eq("status", status);
  if (project) query = query.eq("project_interest", project);
  if (canton) query = query.eq("canton", canton);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data } = await query;
  const rows = (data ?? []) as ProjectInterest[];

  const headers = [
    "Eingegangen",
    "Projekt",
    "Betrieb",
    "Vorname",
    "Nachname",
    "E-Mail",
    "Telefon",
    "Adresse",
    "PLZ",
    "Ort",
    "Kanton",
    "Einsatzbedarf WILDSEEK",
    "Fläche",
    "Zaunlänge m",
    "Nutztierart(en)",
    "Situation",
    "Bemerkungen",
    "Status",
  ];

  const csvRows = rows.map((r) => [
    fmtDateTime(r.created_at),
    optionLabel(PROJECT_INTEREST_OPTIONS, r.project_interest),
    r.organization,
    r.first_name,
    r.last_name,
    r.email,
    r.phone,
    r.address,
    r.postal_code,
    r.city,
    cantonLabel(r.canton),
    r.wildseek_need,
    r.wildseek_area,
    r.fence_length_m,
    r.livestock_types,
    r.fence_situation,
    r.notes,
    optionLabel(INTEREST_STATUSES, r.status),
  ]);

  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`interessenten-${date}.csv`, toCsv(headers, csvRows));
}
