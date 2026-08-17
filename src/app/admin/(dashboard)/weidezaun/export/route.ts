import { requireAdmin } from "@/lib/auth-guard";
import { toCsv, csvResponse } from "@/lib/forms/csv";
import {
  cantonLabel,
  optionLabel,
  FENCE_TYPES,
  FENCE_COLORS,
  MAINTENANCE_OPTIONS,
} from "@/lib/forms/constants";
import { eventsSummary, fmtDate, fmtDateTime } from "@/lib/forms/format";
import type { FenceReport } from "@/lib/forms/types";

export async function GET(request: Request) {
  const { supabase } = await requireAdmin();
  const params = new URL(request.url).searchParams;

  let query = supabase
    .from("fence_reports")
    .select("*")
    .order("created_at", { ascending: false });
  const group = params.get("group");
  const canton = params.get("canton");
  const zaunart = params.get("zaunart");
  const minheight = params.get("minheight");
  const from = params.get("from");
  const to = params.get("to");
  if (group) query = query.eq("report_group", group);
  if (canton) query = query.eq("canton", canton);
  if (zaunart) query = query.eq("fence_type", zaunart);
  if (minheight) query = query.gte("fence_height_cm", Number(minheight));
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data } = await query;
  const rows = (data ?? []) as FenceReport[];

  const headers = [
    "Eingegangen",
    "Gruppe",
    "Betrieb",
    "Vorname",
    "Nachname",
    "E-Mail",
    "Telefon",
    "Kanton",
    "Gemeinde/Ort",
    "Installationsdatum",
    "Systembezeichnung",
    "Zaunart",
    "Zaunart (andere)",
    "Farbe",
    "Farbe (andere)",
    "Alter",
    "Zaunhöhe cm",
    "Zaunlänge m",
    "Nutztierart(en)",
    "Anzahl Nutztiere",
    "Beobachtung von",
    "Beobachtung bis",
    "Betriebstage",
    "Verhedderung",
    "Verhedderung Ereignisse",
    "Verhedderung Details",
    "verletzte Wildtiere",
    "verendete Wildtiere",
    "Wolfsriss",
    "Wolf Ereignisse",
    "Wolf verletzte NT",
    "Wolf getötete NT",
    "Wolf Bemerkung",
    "Wartung",
    "Wartung Bemerkung",
    "Anzahl Bilder",
    "Veröffentlichung erlaubt",
    "Status",
  ];

  const csvRows = rows.map((r) => {
    const injured = (r.entanglement_events ?? [])
      .filter((e) => e.outcome === "verletzt")
      .reduce((s, e) => s + e.count, 0);
    const dead = (r.entanglement_events ?? [])
      .filter((e) => e.outcome === "verendet")
      .reduce((s, e) => s + e.count, 0);
    return [
      fmtDateTime(r.created_at),
      r.report_group === "project" ? "Projekt" : "Vergleich",
      r.organization,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      cantonLabel(r.canton),
      r.municipality,
      fmtDate(r.installation_date),
      r.system_label,
      r.fence_type === "andere"
        ? "Andere"
        : optionLabel(FENCE_TYPES, r.fence_type),
      r.fence_type_other,
      r.fence_color === "andere"
        ? "Andere"
        : r.fence_color
          ? optionLabel(FENCE_COLORS, r.fence_color)
          : "",
      r.fence_color_other,
      r.fence_age,
      r.fence_height_cm,
      r.fence_length_m,
      r.livestock_types,
      r.livestock_count,
      fmtDate(r.observation_from),
      fmtDate(r.observation_to),
      r.operating_days,
      r.entanglement_occurred ? "ja" : "nein",
      r.entanglement_event_count,
      eventsSummary(r.entanglement_events),
      injured,
      dead,
      r.wolf_attack_occurred ? "ja" : "nein",
      r.wolf_attack_event_count,
      r.wolf_injured_livestock,
      r.wolf_killed_livestock,
      r.wolf_note,
      r.maintenance ? optionLabel(MAINTENANCE_OPTIONS, r.maintenance) : "",
      r.maintenance_note,
      r.images?.length ?? 0,
      r.image_publish_consent ? "ja" : "nein",
      r.status,
    ];
  });

  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`weidezaun-${date}.csv`, toCsv(headers, csvRows));
}
