import type { AnimalEntry, EntanglementEvent } from "./types";
import { optionLabel, OUTCOMES } from "./constants";

// Date-only string (YYYY-MM-DD) → DD.MM.YYYY, timezone-safe.
export function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : s;
}

// Timestamp → localised Zurich date + time.
export function fmtDateTime(s: string | null | undefined): string {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString("de-CH", {
    timeZone: "Europe/Zurich",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function orDash(v: string | number | null | undefined): string {
  return v === null || v === undefined || v === "" ? "—" : String(v);
}

export function animalsSummary(list: AnimalEntry[] | null | undefined): string {
  if (!list || list.length === 0) return "—";
  return list.map((a) => `${a.species} ${a.count}`).join(", ");
}

export function animalsTotal(list: AnimalEntry[] | null | undefined): number {
  return (list ?? []).reduce((sum, a) => sum + (Number(a.count) || 0), 0);
}

export function eventsSummary(
  list: EntanglementEvent[] | null | undefined
): string {
  if (!list || list.length === 0) return "—";
  return list
    .map(
      (e) => `${e.species} ${e.count} (${optionLabel(OUTCOMES, e.outcome)})`
    )
    .join(", ");
}
