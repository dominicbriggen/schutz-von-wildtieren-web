import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import {
  cantonLabel,
  SUBMISSION_STATUSES,
  FENCE_TYPES,
  FENCE_COLORS,
  MAINTENANCE_OPTIONS,
  OUTCOMES,
  optionLabel,
} from "@/lib/forms/constants";
import { fmtDate, fmtDateTime, orDash } from "@/lib/forms/format";
import type { FenceReport } from "@/lib/forms/types";
import {
  setSubmissionStatus,
  setAdminNote,
  deleteSubmission,
} from "@/lib/actions/mitmachen-admin";
import { StatusSelect } from "@/components/admin/mitmachen/status-select";
import { AdminNote } from "@/components/admin/mitmachen/admin-note";
import { DeleteAndBack } from "@/components/admin/mitmachen/delete-and-back";
import { GroupBadge } from "@/components/admin/mitmachen/table-ui";
import {
  DetailBackLink,
  DetailGroup,
  Field,
  SignedImageGrid,
  type SignedImage,
} from "@/components/admin/mitmachen/detail";

export const dynamic = "force-dynamic";

export default async function WeidezaunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("fence_reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const r = data as FenceReport;
  const isComparison = r.report_group === "comparison";

  const images: SignedImage[] = await Promise.all(
    (r.images ?? []).map(async (img) => {
      const { data: signed } = await supabase.storage
        .from("form-uploads")
        .createSignedUrl(img.path, 600);
      return { url: signed?.signedUrl ?? null, name: img.name, type: img.type };
    })
  );

  return (
    <div className="max-w-3xl">
      <DetailBackLink href="/admin/weidezaun" label="Zurück zur Übersicht" />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              {r.organization}
            </h1>
            <GroupBadge group={r.report_group} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Weidezaun-Rückmeldung · eingegangen {fmtDateTime(r.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect
            current={r.status}
            options={SUBMISSION_STATUSES}
            action={setSubmissionStatus.bind(null, "fence", r.id)}
          />
          <DeleteAndBack
            itemLabel={`Weidezaun-Rückmeldung ${r.organization}`}
            backHref="/admin/weidezaun"
            action={deleteSubmission.bind(null, "fence", r.id)}
          />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <DetailGroup title="Betrieb">
          <Field label="Betrieb / Organisation">{r.organization}</Field>
          <Field label="Name">
            {r.first_name} {r.last_name}
          </Field>
          <Field label="E-Mail">
            <a href={`mailto:${r.email}`} className="text-brand hover:underline">
              {r.email}
            </a>
          </Field>
          <Field label="Telefon">{orDash(r.phone)}</Field>
          <Field label="Kanton">{cantonLabel(r.canton)}</Field>
          <Field label="Gemeinde / Ort">{r.municipality}</Field>
        </DetailGroup>

        <DetailGroup title="Zaunsystem">
          {isComparison ? (
            <>
              <Field label="Zaunart">
                {r.fence_type === "andere"
                  ? `Andere: ${r.fence_type_other || "—"}`
                  : optionLabel(FENCE_TYPES, r.fence_type)}
              </Field>
              <Field label="Farbe">
                {r.fence_color === "andere"
                  ? `Andere: ${r.fence_color_other || "—"}`
                  : optionLabel(FENCE_COLORS, r.fence_color)}
              </Field>
              <Field label="Alter des Zauns">{orDash(r.fence_age)}</Field>
            </>
          ) : (
            <>
              <Field label="Installationsdatum">
                {fmtDate(r.installation_date)}
              </Field>
              <Field label="Systembezeichnung">{orDash(r.system_label)}</Field>
            </>
          )}
          <Field label="Zaunhöhe (cm)">{orDash(r.fence_height_cm)}</Field>
          <Field label="Zaunlänge (m)">{orDash(r.fence_length_m)}</Field>
          <Field label="Nutztierart(en)">{orDash(r.livestock_types)}</Field>
          <Field label="Anzahl Nutztiere">{orDash(r.livestock_count)}</Field>
        </DetailGroup>

        <DetailGroup title="Beobachtungszeitraum">
          <Field label="Von">{fmtDate(r.observation_from)}</Field>
          <Field label="Bis">{fmtDate(r.observation_to)}</Field>
          <Field label="Betriebstage">{orDash(r.operating_days)}</Field>
        </DetailGroup>

        <DetailGroup title="Verhedderungen von Wildtieren">
          <Field label="Aufgetreten">
            {r.entanglement_occurred ? "Ja" : "Nein"}
          </Field>
          <Field label="Anzahl Ereignisse">
            {orDash(r.entanglement_event_count)}
          </Field>
          {r.entanglement_events.length > 0 && (
            <Field label="Betroffene Wildtiere" full>
              <ul className="space-y-0.5">
                {r.entanglement_events.map((e, i) => (
                  <li key={i}>
                    {e.species}: <strong>{e.count}</strong> (
                    {optionLabel(OUTCOMES, e.outcome)})
                  </li>
                ))}
              </ul>
            </Field>
          )}
        </DetailGroup>

        <DetailGroup title="Wolfsrisse">
          <Field label="Aufgetreten">
            {r.wolf_attack_occurred ? "Ja" : "Nein"}
          </Field>
          <Field label="Anzahl Ereignisse">
            {orDash(r.wolf_attack_event_count)}
          </Field>
          <Field label="Verletzte Nutztiere">
            {orDash(r.wolf_injured_livestock)}
          </Field>
          <Field label="Getötete Nutztiere">
            {orDash(r.wolf_killed_livestock)}
          </Field>
          {r.wolf_note && (
            <Field label="Bemerkung" full>
              {r.wolf_note}
            </Field>
          )}
        </DetailGroup>

        {!isComparison && (
          <DetailGroup title="Wartung">
            <Field label="Regelmässig kontrolliert / gepflegt">
              {r.maintenance
                ? optionLabel(MAINTENANCE_OPTIONS, r.maintenance)
                : "—"}
            </Field>
            {r.maintenance_note && (
              <Field label="Bemerkung" full>
                {r.maintenance_note}
              </Field>
            )}
          </DetailGroup>
        )}

        <section className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">Bilder</h2>
          <div className="mt-4">
            <SignedImageGrid images={images} consent={r.image_publish_consent} />
          </div>
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">
            Interne Notiz
          </h2>
          <div className="mt-4">
            <AdminNote
              initial={r.admin_note ?? ""}
              action={setAdminNote.bind(null, "fence", r.id)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
