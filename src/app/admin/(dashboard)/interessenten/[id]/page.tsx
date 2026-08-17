import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import {
  cantonLabel,
  INTEREST_STATUSES,
  PROJECT_INTEREST_OPTIONS,
  optionLabel,
} from "@/lib/forms/constants";
import { fmtDateTime, orDash } from "@/lib/forms/format";
import type { ProjectInterest } from "@/lib/forms/types";
import {
  setInterestStatus,
  setAdminNote,
  deleteSubmission,
} from "@/lib/actions/mitmachen-admin";
import { StatusSelect } from "@/components/admin/mitmachen/status-select";
import { AdminNote } from "@/components/admin/mitmachen/admin-note";
import { DeleteAndBack } from "@/components/admin/mitmachen/delete-and-back";
import {
  DetailBackLink,
  DetailGroup,
  Field,
} from "@/components/admin/mitmachen/detail";

export const dynamic = "force-dynamic";

export default async function InteressentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("project_interests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const r = data as ProjectInterest;

  const showWildseek =
    r.project_interest === "wildseek" || r.project_interest === "beide";
  const showFence =
    r.project_interest === "weidezaun" || r.project_interest === "beide";

  return (
    <div className="max-w-3xl">
      <DetailBackLink href="/admin/interessenten" label="Zurück zur Übersicht" />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {r.organization || `${r.first_name} ${r.last_name}`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Projektinteresse ·{" "}
            {optionLabel(PROJECT_INTEREST_OPTIONS, r.project_interest)} ·
            eingegangen {fmtDateTime(r.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect
            current={r.status}
            options={INTEREST_STATUSES}
            action={setInterestStatus.bind(null, r.id)}
          />
          <DeleteAndBack
            itemLabel={`Interessent ${r.first_name} ${r.last_name}`}
            backHref="/admin/interessenten"
            action={deleteSubmission.bind(null, "interest", r.id)}
          />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <DetailGroup title="Kontaktdaten">
          <Field label="Betrieb">{orDash(r.organization)}</Field>
          <Field label="Name">
            {r.first_name} {r.last_name}
          </Field>
          <Field label="E-Mail">
            <a href={`mailto:${r.email}`} className="text-brand hover:underline">
              {r.email}
            </a>
          </Field>
          <Field label="Telefon">{orDash(r.phone)}</Field>
          <Field label="Adresse">{orDash(r.address)}</Field>
          <Field label="PLZ / Ort">
            {[r.postal_code, r.city].filter(Boolean).join(" ") || "—"}
          </Field>
          <Field label="Kanton">{cantonLabel(r.canton)}</Field>
        </DetailGroup>

        <DetailGroup title="Bedarf">
          {showWildseek && (
            <>
              <Field label="Einsatzbedarf WILDSEEK" full>
                {orDash(r.wildseek_need)}
              </Field>
              <Field label="Bewirtschaftete Fläche">
                {orDash(r.wildseek_area)}
              </Field>
            </>
          )}
          {showFence && (
            <>
              <Field label="Benötigte Zaunlänge (m)">
                {orDash(r.fence_length_m)}
              </Field>
              <Field label="Nutztierart(en)">{orDash(r.livestock_types)}</Field>
              <Field label="Beschreibung der Situation" full>
                {orDash(r.fence_situation)}
              </Field>
            </>
          )}
          {!showWildseek && !showFence && (
            <Field label="Angaben" full>
              —
            </Field>
          )}
        </DetailGroup>

        {r.notes && (
          <DetailGroup title="Weitere Bemerkungen">
            <Field label="Bemerkung" full>
              {r.notes}
            </Field>
          </DetailGroup>
        )}

        <section className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">
            Interne Notiz
          </h2>
          <div className="mt-4">
            <AdminNote
              initial={r.admin_note ?? ""}
              action={setAdminNote.bind(null, "interest", r.id)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
