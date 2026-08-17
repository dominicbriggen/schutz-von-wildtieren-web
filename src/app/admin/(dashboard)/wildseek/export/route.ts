import { requireAdmin } from "@/lib/auth-guard";
import { toCsv, csvResponse } from "@/lib/forms/csv";
import { cantonLabel } from "@/lib/forms/constants";
import { animalsSummary, animalsTotal, fmtDate, fmtDateTime } from "@/lib/forms/format";
import type { WildseekReport } from "@/lib/forms/types";

export async function GET(request: Request) {
  const { supabase } = await requireAdmin();
  const params = new URL(request.url).searchParams;

  let query = supabase
    .from("wildseek_reports")
    .select("*")
    .order("created_at", { ascending: false });
  const canton = params.get("canton");
  const mounting = params.get("mounting");
  const from = params.get("from");
  const to = params.get("to");
  if (canton) query = query.eq("canton", canton);
  if (mounting) query = query.eq("mounting_type", mounting);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data } = await query;
  const rows = (data ?? []) as WildseekReport[];

  const headers = [
    "Eingegangen",
    "Betrieb",
    "Vorname",
    "Nachname",
    "E-Mail",
    "Telefon",
    "Kanton",
    "Gemeinde/Ort",
    "Systemnummer",
    "Berichtszeitraum von",
    "Berichtszeitraum bis",
    "Anzahl Einsätze",
    "Montageart",
    "Gerettete Tiere",
    "Tiere total",
    "Bemerkungen",
    "Anzahl Bilder",
    "Veröffentlichung erlaubt",
    "Status",
  ];

  const csvRows = rows.map((r) => [
    fmtDateTime(r.created_at),
    r.organization,
    r.first_name,
    r.last_name,
    r.email,
    r.phone,
    cantonLabel(r.canton),
    r.municipality,
    r.system_number,
    fmtDate(r.report_from),
    fmtDate(r.report_to),
    r.deployment_count,
    r.mounting_type === "andere"
      ? `Andere: ${r.mounting_type_other ?? ""}`
      : r.mounting_type,
    r.no_rescue ? "keine" : animalsSummary(r.rescued_animals),
    animalsTotal(r.rescued_animals),
    r.notes,
    r.images?.length ?? 0,
    r.image_publish_consent ? "ja" : "nein",
    r.status,
  ]);

  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`wildseek-${date}.csv`, toCsv(headers, csvRows));
}
