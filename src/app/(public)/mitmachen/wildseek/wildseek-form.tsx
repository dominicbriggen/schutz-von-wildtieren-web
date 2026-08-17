"use client";

import { useActionState, useState } from "react";
import {
  submitWildseekReport,
  type MitmachenFormState,
} from "@/lib/actions/mitmachen";
import { CANTONS } from "@/lib/forms/constants";
import {
  FormSection,
  FieldGrid,
  TextField,
  TextareaField,
  NativeSelectField,
  FormError,
  SubmitButton,
} from "@/components/forms/fields";
import { AnimalCountRows } from "@/components/forms/repeatable";
import { ImageUploader } from "@/components/forms/image-uploader";
import { ConsentFields } from "@/components/forms/consent-fields";
import { SpamGuardFields } from "@/components/forms/spam-guard";
import { SuccessPanel } from "@/components/forms/success-panel";

const initial: MitmachenFormState = { status: "idle" };

export function WildseekForm({ mountingTypes }: { mountingTypes: string[] }) {
  const [state, action, pending] = useActionState(submitWildseekReport, initial);
  const [noRescue, setNoRescue] = useState(false);
  const [mountingType, setMountingType] = useState("");

  if (state.status === "success") {
    return (
      <SuccessPanel title="Vielen Dank für Ihre Rückmeldung.">
        Ihre Angaben wurden erfolgreich übermittelt und helfen uns dabei, unsere
        Projekte besser zu dokumentieren und weiterzuentwickeln.
      </SuccessPanel>
    );
  }

  const mountingOptions = [
    ...mountingTypes.map((t) => ({ value: t, label: t })),
    { value: "andere", label: "Andere Montageart" },
  ];

  return (
    <form action={action} className="space-y-10" noValidate>
      <SpamGuardFields />

      <FormSection title="Kontaktdaten">
        <TextField
          label="Betrieb / Organisation"
          name="organization"
          required
          autoComplete="organization"
        />
        <FieldGrid>
          <TextField label="Vorname" name="first_name" required autoComplete="given-name" />
          <TextField label="Nachname" name="last_name" required autoComplete="family-name" />
        </FieldGrid>
        <FieldGrid>
          <TextField
            label="E-Mail"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
          />
          <TextField
            label="Telefon"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </FieldGrid>
        <FieldGrid>
          <NativeSelectField
            label="Kanton"
            name="canton"
            required
            options={CANTONS}
            placeholder="Kanton wählen"
          />
          <TextField label="Gemeinde / Ort" name="municipality" required />
        </FieldGrid>
        <TextField
          label="WILDSEEK-Systemnummer"
          name="system_number"
          hint="Falls vorhanden."
        />
      </FormSection>

      <FormSection title="Einsatz">
        <FieldGrid>
          <TextField label="Berichtszeitraum von" name="report_from" type="date" />
          <TextField label="Berichtszeitraum bis" name="report_to" type="date" />
        </FieldGrid>
        <TextField
          label="Anzahl WILDSEEK-Einsätze"
          name="deployment_count"
          type="number"
          inputMode="numeric"
          min={0}
        />
        <NativeSelectField
          label="Montageart"
          name="mounting_type"
          options={mountingOptions}
          placeholder="Montageart wählen"
          value={mountingType}
          onChange={setMountingType}
          hint={
            mountingTypes.length === 0
              ? "Die Auswahl gängiger Montagearten wird derzeit vorbereitet – bitte «Andere Montageart» wählen und ergänzen."
              : undefined
          }
        />
        {mountingType === "andere" && (
          <TextField
            label="Andere Montageart"
            name="mounting_type_other"
            placeholder="Bitte beschreiben"
          />
        )}
      </FormSection>

      <FormSection
        title="Gerettete Tiere"
        description="Erfassen Sie jede Tierart mit der jeweiligen Anzahl separat."
      >
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground select-none">
          <input
            type="checkbox"
            name="no_rescue"
            checked={noRescue}
            onChange={(e) => setNoRescue(e.target.checked)}
            className="size-5 shrink-0 rounded border-input accent-[var(--primary)] focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          Keine Tierrettung in diesem Berichtszeitraum
        </label>
        <AnimalCountRows name="rescued_animals" disabled={noRescue} />
      </FormSection>

      <FormSection title="Erfahrungen">
        <TextareaField
          label="Erfahrungen / Bemerkungen"
          name="notes"
          rows={5}
          placeholder="Was ist Ihnen aufgefallen? Gibt es Hinweise für uns?"
        />
      </FormSection>

      <FormSection
        title="Bilder"
        description="Bilder werden vertraulich gespeichert und nicht automatisch veröffentlicht."
      >
        <ImageUploader folder="wildseek" />
      </FormSection>

      <ConsentFields withImageConsent />

      <div className="space-y-4">
        <FormError message={state.message} />
        <SubmitButton label="Rückmeldung absenden" pending={pending} />
      </div>
    </form>
  );
}
