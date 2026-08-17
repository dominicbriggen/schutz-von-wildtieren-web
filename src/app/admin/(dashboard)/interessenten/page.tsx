import Link from "next/link";
import { Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  cantonLabel,
  CANTONS,
  INTEREST_STATUSES,
  PROJECT_INTEREST_OPTIONS,
  optionLabel,
} from "@/lib/forms/constants";
import { fmtDateTime, orDash } from "@/lib/forms/format";
import type { ProjectInterest } from "@/lib/forms/types";
import { setInterestStatus } from "@/lib/actions/mitmachen-admin";
import { StatusSelect } from "@/components/admin/mitmachen/status-select";
import {
  Th,
  Td,
  StatCard,
  FilterSelect,
  FilterDate,
} from "@/components/admin/mitmachen/table-ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SP = Promise<{
  status?: string;
  project?: string;
  canton?: string;
  from?: string;
  to?: string;
}>;

export default async function AdminInteressentenPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("project_interests")
    .select("*")
    .order("created_at", { ascending: false });
  if (sp.status) query = query.eq("status", sp.status);
  if (sp.project) query = query.eq("project_interest", sp.project);
  if (sp.canton) query = query.eq("canton", sp.canton);
  if (sp.from) query = query.gte("created_at", sp.from);
  if (sp.to) query = query.lte("created_at", `${sp.to}T23:59:59`);

  const { data } = await query;
  const rows = (data ?? []) as ProjectInterest[];

  const openCount = rows.filter((r) =>
    ["neu", "kontaktiert", "warteliste"].includes(r.status)
  ).length;

  const exportQs = new URLSearchParams(
    Object.entries(sp).filter(([, v]) => v) as [string, string][]
  ).toString();

  return (
    <div>
      <AdminPageHeader
        title="Projektinteressenten / Warteliste"
        description="Interessierte Betriebe verwalten und Status pflegen."
        action={
          <Link
            href={`/admin/interessenten/export${exportQs ? `?${exportQs}` : ""}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Download className="size-4" /> CSV exportieren
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Einträge (Auswahl)" value={rows.length} />
        <StatCard label="Offen (neu / kontaktiert / Warteliste)" value={openCount} />
        <StatCard
          label="Zugesagt"
          value={rows.filter((r) => r.status === "zugesagt").length}
        />
      </div>

      {/* Filter */}
      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
      >
        <FilterSelect
          name="status"
          label="Status"
          value={sp.status}
          options={INTEREST_STATUSES}
        />
        <FilterSelect
          name="project"
          label="Projekt"
          value={sp.project}
          options={PROJECT_INTEREST_OPTIONS}
        />
        <FilterSelect
          name="canton"
          label="Kanton"
          value={sp.canton}
          options={CANTONS}
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
          href="/admin/interessenten"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Zurücksetzen
        </Link>
      </form>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <Th>Datum</Th>
              <Th>Betrieb</Th>
              <Th>Kanton</Th>
              <Th>Projekt</Th>
              <Th>Kontakt</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  Keine Einträge für die aktuelle Auswahl.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/70 last:border-0">
                <Td className="whitespace-nowrap text-muted-foreground">
                  {fmtDateTime(r.created_at)}
                </Td>
                <Td className="font-medium text-foreground">
                  {orDash(r.organization)}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {r.first_name} {r.last_name}
                  </span>
                </Td>
                <Td>{cantonLabel(r.canton)}</Td>
                <Td>{optionLabel(PROJECT_INTEREST_OPTIONS, r.project_interest)}</Td>
                <Td>
                  <a href={`mailto:${r.email}`} className="text-brand hover:underline">
                    {r.email}
                  </a>
                  <span className="block text-xs text-muted-foreground">
                    {orDash(r.phone)}
                  </span>
                </Td>
                <Td>
                  <StatusSelect
                    current={r.status}
                    options={INTEREST_STATUSES}
                    action={setInterestStatus.bind(null, r.id)}
                  />
                </Td>
                <Td>
                  <Link
                    href={`/admin/interessenten/${r.id}`}
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
