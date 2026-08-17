import Link from "next/link";
import { Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getMountingTypes } from "@/lib/content";
import { cantonLabel, CANTONS, SUBMISSION_STATUSES } from "@/lib/forms/constants";
import {
  animalsSummary,
  animalsTotal,
  fmtDateTime,
  orDash,
} from "@/lib/forms/format";
import type { WildseekReport } from "@/lib/forms/types";
import { setSubmissionStatus } from "@/lib/actions/mitmachen-admin";
import { StatusSelect } from "@/components/admin/mitmachen/status-select";
import { MountingTypesEditor } from "@/components/admin/mitmachen/mounting-types-editor";
import {
  Th,
  Td,
  StatCard,
  Breakdown,
  FilterSelect,
  FilterDate,
} from "@/components/admin/mitmachen/table-ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SP = Promise<{ canton?: string; mounting?: string; from?: string; to?: string }>;

export default async function AdminWildseekPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const [mountingTypes] = await Promise.all([getMountingTypes()]);

  let query = supabase
    .from("wildseek_reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (sp.canton) query = query.eq("canton", sp.canton);
  if (sp.mounting) query = query.eq("mounting_type", sp.mounting);
  if (sp.from) query = query.gte("created_at", sp.from);
  if (sp.to) query = query.lte("created_at", `${sp.to}T23:59:59`);

  const { data } = await query;
  const reports = (data ?? []) as WildseekReport[];

  // ── Auswertung (bezogen auf die aktuelle Auswahl) ─────────────────────
  const totalDeployments = reports.reduce(
    (s, r) => s + (r.deployment_count ?? 0),
    0
  );
  const speciesTotals = new Map<string, number>();
  let totalAnimals = 0;
  for (const r of reports) {
    for (const a of r.rescued_animals ?? []) {
      speciesTotals.set(a.species, (speciesTotals.get(a.species) ?? 0) + a.count);
      totalAnimals += a.count;
    }
  }
  const mountingBreakdown = new Map<string, number>();
  for (const r of reports) {
    const label =
      r.mounting_type === "andere" || !r.mounting_type
        ? r.mounting_type_other
          ? `Andere: ${r.mounting_type_other}`
          : r.mounting_type
            ? "Andere"
            : "—"
        : r.mounting_type;
    mountingBreakdown.set(label, (mountingBreakdown.get(label) ?? 0) + 1);
  }

  const exportQs = new URLSearchParams(
    Object.entries(sp).filter(([, v]) => v) as [string, string][]
  ).toString();

  const mountingFilterOptions = [
    ...mountingTypes.map((t) => ({ value: t, label: t })),
    { value: "andere", label: "Andere" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="WILDSEEK-Rückmeldungen"
        description="Eingegangene Einsatzmeldungen einsehen, filtern, auswerten und exportieren."
        action={
          <Link
            href={`/admin/wildseek/export${exportQs ? `?${exportQs}` : ""}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Download className="size-4" /> CSV exportieren
          </Link>
        }
      />

      {/* Auswertung */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Rückmeldungen" value={reports.length} />
        <StatCard label="Gemeldete Einsätze" value={totalDeployments} />
        <StatCard label="Gerettete Tiere (total)" value={totalAnimals} />
        <StatCard label="Erfasste Tierarten" value={speciesTotals.size} />
      </div>

      {(speciesTotals.size > 0 || mountingBreakdown.size > 0) && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Breakdown
            title="Gerettete Tiere nach Tierart"
            rows={[...speciesTotals.entries()].sort((a, b) => b[1] - a[1])}
          />
          <Breakdown
            title="Montagearten"
            rows={[...mountingBreakdown.entries()].sort((a, b) => b[1] - a[1])}
          />
        </div>
      )}

      {/* Filter */}
      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
      >
        <FilterSelect
          name="canton"
          label="Kanton"
          value={sp.canton}
          options={CANTONS}
        />
        <FilterSelect
          name="mounting"
          label="Montageart"
          value={sp.mounting}
          options={mountingFilterOptions}
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
          href="/admin/wildseek"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Zurücksetzen
        </Link>
      </form>

      {/* Tabelle */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <Th>Datum</Th>
              <Th>Betrieb</Th>
              <Th>Kanton</Th>
              <Th className="text-right">Einsätze</Th>
              <Th>Gerettete Tiere</Th>
              <Th>Montageart</Th>
              <Th className="text-center">Bilder</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-muted-foreground">
                  Keine Rückmeldungen für die aktuelle Auswahl.
                </td>
              </tr>
            )}
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-border/70 last:border-0">
                <Td className="whitespace-nowrap text-muted-foreground">
                  {fmtDateTime(r.created_at)}
                </Td>
                <Td className="font-medium text-foreground">
                  {r.organization}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {r.first_name} {r.last_name}
                  </span>
                </Td>
                <Td>{cantonLabel(r.canton)}</Td>
                <Td className="text-right">{orDash(r.deployment_count)}</Td>
                <Td>
                  {animalsTotal(r.rescued_animals) > 0
                    ? animalsSummary(r.rescued_animals)
                    : r.no_rescue
                      ? "keine"
                      : "—"}
                </Td>
                <Td>
                  {r.mounting_type === "andere"
                    ? r.mounting_type_other || "Andere"
                    : orDash(r.mounting_type)}
                </Td>
                <Td className="text-center">{r.images?.length ?? 0}</Td>
                <Td>
                  <StatusSelect
                    current={r.status}
                    options={SUBMISSION_STATUSES}
                    action={setSubmissionStatus.bind(null, "wildseek", r.id)}
                  />
                </Td>
                <Td>
                  <Link
                    href={`/admin/wildseek/${r.id}`}
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

      {/* Montagearten pflegen */}
      <section className="mt-12 max-w-2xl">
        <h2 className="text-lg font-semibold text-foreground">
          Montagearten verwalten
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Diese Bezeichnungen erscheinen als Auswahl im öffentlichen
          WILDSEEK-Formular. Das Formular bietet zusätzlich immer «Andere
          Montageart» mit Freitext an.
        </p>
        <div className="mt-4">
          <MountingTypesEditor initial={mountingTypes} />
        </div>
      </section>
    </div>
  );
}

