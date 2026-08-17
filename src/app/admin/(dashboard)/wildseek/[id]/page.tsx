import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import {
  cantonLabel,
  SUBMISSION_STATUSES,
} from "@/lib/forms/constants";
import { fmtDate, fmtDateTime, orDash } from "@/lib/forms/format";
import type { WildseekReport } from "@/lib/forms/types";
import {
  setSubmissionStatus,
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
  SignedImageGrid,
  type SignedImage,
} from "@/components/admin/mitmachen/detail";

export const dynamic = "force-dynamic";

export default async function WildseekDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("wildseek_reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const r = data as WildseekReport;

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
      <DetailBackLink href="/admin/wildseek" label="Zurück zur Übersicht" />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {r.organization}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            WILDSEEK-Rückmeldung · eingegangen {fmtDateTime(r.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect
            current={r.status}
            options={SUBMISSION_STATUSES}
            action={setSubmissionStatus.bind(null, "wildseek", r.id)}
          />
          <DeleteAndBack
            itemLabel={`WILDSEEK-Rückmeldung ${r.organization}`}
            backHref="/admin/wildseek"
            action={deleteSubmission.bind(null, "wildseek", r.id)}
          />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <DetailGroup title="Kontaktdaten">
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
          <Field label="WILDSEEK-Systemnummer">{orDash(r.system_number)}</Field>
        </DetailGroup>

        <DetailGroup title="Einsatz">
          <Field label="Berichtszeitraum von">{fmtDate(r.report_from)}</Field>
          <Field label="Berichtszeitraum bis">{fmtDate(r.report_to)}</Field>
          <Field label="Anzahl Einsätze">{orDash(r.deployment_count)}</Field>
          <Field label="Montageart">
            {r.mounting_type === "andere"
              ? `Andere: ${r.mounting_type_other || "—"}`
              : orDash(r.mounting_type)}
          </Field>
        </DetailGroup>

        <DetailGroup title="Gerettete Tiere">
          {r.no_rescue ? (
            <Field label="Angabe" full>
              Keine Tierrettung in diesem Berichtszeitraum.
            </Field>
          ) : r.rescued_animals?.length ? (
            <Field label="Tierarten" full>
              <ul className="space-y-0.5">
                {r.rescued_animals.map((a, i) => (
                  <li key={i}>
                    {a.species}: <strong>{a.count}</strong>
                  </li>
                ))}
              </ul>
            </Field>
          ) : (
            <Field label="Tierarten" full>
              —
            </Field>
          )}
        </DetailGroup>

        {r.notes && (
          <DetailGroup title="Erfahrungen / Bemerkungen">
            <Field label="Rückmeldung" full>
              {r.notes}
            </Field>
          </DetailGroup>
        )}

        <section className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">Bilder</h2>
          <div className="mt-4">
            <SignedImageGrid
              images={images}
              consent={r.image_publish_consent}
            />
          </div>
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">
            Interne Notiz
          </h2>
          <div className="mt-4">
            <AdminNote
              initial={r.admin_note ?? ""}
              action={setAdminNote.bind(null, "wildseek", r.id)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
