import Link from "next/link";
import { Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  cantonLabel,
  CANTONS,
  FENCE_TYPES,
  SUBMISSION_STATUSES,
  optionLabel,
} from "@/lib/forms/constants";
import { fmtDateTime, orDash } from "@/lib/forms/format";
import type { FenceReport } from "@/lib/forms/types";
import { setSubmissionStatus } from "@/lib/actions/mitmachen-admin";
import { StatusSelect } from "@/components/admin/mitmachen/status-select";
import {
  Th,
  Td,
  GroupBadge,
  FilterSelect,
  FilterDate,
  FilterNumber,
} from "@/components/admin/mitmachen/table-ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SP = Promise<{
  group?: string;
  canton?: string;
  zaunart?: string;
  minheight?: string;
  from?: string;
  to?: string;
}>;

function aggregate(rows: FenceReport[]) {
  let length = 0,
    days = 0,
    entEvents = 0,
    injuredWild = 0,
    deadWild = 0,
    wolfEvents = 0,
    wolfInjured = 0,
    wolfKilled = 0;
  for (const r of rows) {
    length += r.fence_length_m ?? 0;
    days += r.operating_days ?? 0;
    entEvents += r.entanglement_events?.length ?? 0;
    for (const e of r.entanglement_events ?? []) {
      if (e.outcome === "verletzt") injuredWild += e.count;
      if (e.outcome === "verendet") deadWild += e.count;
    }
    if (r.wolf_attack_occurred) {
      wolfEvents += r.wolf_attack_event_count ?? 0;
      wolfInjured += r.wolf_injured_livestock ?? 0;
      wolfKilled += r.wolf_killed_livestock ?? 0;
    }
  }
  return {
    count: rows.length,
    length,
    days,
    entEvents,
    injuredWild,
    deadWild,
    wolfEvents,
    wolfInjured,
    wolfKilled,
  };
}

export default async function AdminWeidezaunPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("fence_reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (sp.group) query = query.eq("report_group", sp.group);
  if (sp.canton) query = query.eq("canton", sp.canton);
  if (sp.zaunart) query = query.eq("fence_type", sp.zaunart);
  if (sp.minheight) query = query.gte("fence_height_cm", Number(sp.minheight));
  if (sp.from) query = query.gte("created_at", sp.from);
  if (sp.to) query = query.lte("created_at", `${sp.to}T23:59:59`);

  const { data } = await query;
  const rows = (data ?? []) as FenceReport[];

  const project = aggregate(rows.filter((r) => r.report_group === "project"));
  const comparison = aggregate(
    rows.filter((r) => r.report_group === "comparison")
  );

  const exportQs = new URLSearchParams(
    Object.entries(sp).filter(([, v]) => v) as [string, string][]
  ).toString();

  const metrics: { label: string; key: keyof typeof project }[] = [
    { label: "Rückmeldungen", key: "count" },
    { label: "Zaunlänge gesamt (m)", key: "length" },
    { label: "Betriebstage gesamt", key: "days" },
    { label: "Verhedderungsereignisse", key: "entEvents" },
    { label: "davon verletzte Wildtiere", key: "injuredWild" },
    { label: "davon verendete Wildtiere", key: "deadWild" },
    { label: "Wolfsriss-Ereignisse", key: "wolfEvents" },
    { label: "verletzte Nutztiere (Wolf)", key: "wolfInjured" },
    { label: "getötete Nutztiere (Wolf)", key: "wolfKilled" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Weidezaun-Rückmeldungen"
        description="Projekt-Zaunsysteme und Vergleichssysteme vergleichbar einsehen. Rohdaten ohne automatische Schlussfolgerungen."
        action={
          <Link
            href={`/admin/weidezaun/export${exportQs ? `?${exportQs}` : ""}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Download className="size-4" /> CSV exportieren
          </Link>
        }
      />

      {/* Vergleich Projekt vs. andere Systeme */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <Th>Kennzahl (aktuelle Auswahl)</Th>
              <Th className="text-right">Projekt-Zäune</Th>
              <Th className="text-right">Andere Zäune</Th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.key} className="border-b border-border/70 last:border-0">
                <Td className="text-foreground">{m.label}</Td>
                <Td className="text-right font-medium text-primary">
                  {project[m.key]}
                </Td>
                <Td className="text-right font-medium text-primary">
                  {comparison[m.key]}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Summen der aktuellen Auswahl. Bewusst ohne automatische Wertung – die
        Rohdaten dienen der späteren Auswertung.
      </p>

      {/* Filter */}
      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
      >
        <FilterSelect
          name="group"
          label="Gruppe"
          value={sp.group}
          options={[
            { value: "project", label: "Projekt" },
            { value: "comparison", label: "Vergleich" },
          ]}
        />
        <FilterSelect
          name="canton"
          label="Kanton"
          value={sp.canton}
          options={CANTONS}
        />
        <FilterSelect
          name="zaunart"
          label="Zaunart"
          value={sp.zaunart}
          options={FENCE_TYPES}
        />
        <FilterNumber
          name="minheight"
          label="Zaunhöhe ab (cm)"
          value={sp.minheight}
          placeholder="z. B. 90"
        />
        <FilterDate name="from" label="Eingang von" value={sp.from} />
        <FilterDate name="to" label="Eingang bis" value={sp.to} />
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "default", size: "sm" }))}
        >
          Filtern
        </button>
        <Link
          href="/admin/weidezaun"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Zurücksetzen
        </Link>
      </form>

      {/* Tabelle */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <Th>Datum</Th>
              <Th>Gruppe</Th>
              <Th>Betrieb</Th>
              <Th>Kanton</Th>
              <Th>Zaun</Th>
              <Th className="text-right">Höhe cm</Th>
              <Th className="text-right">Länge m</Th>
              <Th className="text-right">Betriebst.</Th>
              <Th className="text-center">Verhedd.</Th>
              <Th className="text-center">Wolf</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="p-6 text-center text-muted-foreground">
                  Keine Rückmeldungen für die aktuelle Auswahl.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/70 last:border-0">
                <Td className="whitespace-nowrap text-muted-foreground">
                  {fmtDateTime(r.created_at)}
                </Td>
                <Td>
                  <GroupBadge group={r.report_group} />
                </Td>
                <Td className="font-medium text-foreground">
                  {r.organization}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {r.first_name} {r.last_name}
                  </span>
                </Td>
                <Td>{cantonLabel(r.canton)}</Td>
                <Td>
                  {r.report_group === "comparison"
                    ? r.fence_type === "andere"
                      ? r.fence_type_other || "Andere"
                      : optionLabel(FENCE_TYPES, r.fence_type)
                    : r.system_label || "Projektsystem"}
                </Td>
                <Td className="text-right">{orDash(r.fence_height_cm)}</Td>
                <Td className="text-right">{orDash(r.fence_length_m)}</Td>
                <Td className="text-right">{orDash(r.operating_days)}</Td>
                <Td className="text-center">
                  {r.entanglement_occurred
                    ? `Ja (${r.entanglement_events?.length ?? 0})`
                    : "Nein"}
                </Td>
                <Td className="text-center">
                  {r.wolf_attack_occurred ? "Ja" : "Nein"}
                </Td>
                <Td>
                  <StatusSelect
                    current={r.status}
                    options={SUBMISSION_STATUSES}
                    action={setSubmissionStatus.bind(null, "fence", r.id)}
                  />
                </Td>
                <Td>
                  <Link
                    href={`/admin/weidezaun/${r.id}`}
                    className="font-medium text-brand hover:underline"
                  >
                    Details
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
