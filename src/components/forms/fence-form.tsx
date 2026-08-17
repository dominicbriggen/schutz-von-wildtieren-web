"use client";

import { useActionState, useState } from "react";
import {
  submitFenceReport,
  type MitmachenFormState,
} from "@/lib/actions/mitmachen";
import {
  CANTONS,
  FENCE_TYPES,
  FENCE_COLORS,
  MAINTENANCE_OPTIONS,
} from "@/lib/forms/constants";
import {
  FormSection,
  FieldGrid,
  TextField,
  TextareaField,
  NativeSelectField,
  SegmentedField,
  FormError,
  SubmitButton,
} from "@/components/forms/fields";
import { EntanglementRows } from "@/components/forms/repeatable";
import { YesNoField } from "@/components/forms/yes-no-field";
import { ImageUploader } from "@/components/forms/image-uploader";
import { ConsentFields } from "@/components/forms/consent-fields";
import { SpamGuardFields } from "@/components/forms/spam-guard";
import { SuccessPanel } from "@/components/forms/success-panel";

const initial: MitmachenFormState = { status: "idle" };

export function FenceForm({ group }: { group: "project" | "comparison" }) {
  const [state, action, pending] = useActionState(submitFenceReport, initial);
  const [entanglement, setEntanglement] = useState<boolean | null>(null);
  const [wolf, setWolf] = useState<boolean | null>(null);
  const [fenceType, setFenceType] = useState("");
  const [fenceColor, setFenceColor] = useState("");

  const isComparison = group === "comparison";

  if (state.status === "success") {
    return (
      <SuccessPanel title="Vielen Dank für Ihre Rückmeldung.">
        Ihre Angaben wurden erfolgreich übermittelt und helfen uns dabei, unsere
        Projekte besser zu dokumentieren und weiterzuentwickeln.
      </SuccessPanel>
    );
  }

  return (
    <form action={action} className="space-y-10" noValidate>
      <SpamGuardFields />
      <input type="hidden" name="report_group" value={group} />

      <FormSection title="Betrieb">
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
          <TextField label="Telefon" name="phone" type="tel" inputMode="tel" autoComplete="tel" />
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
      </FormSection>

      <FormSection title="Zaunsystem">
        {isComparison ? (
          <>
            <FieldGrid>
              <NativeSelectField
                label="Zaunart"
                name="fence_type"
                options={FENCE_TYPES}
                placeholder="Zaunart wählen"
                value={fenceType}
                onChange={setFenceType}
              />
              <NativeSelectField
                label="Farbe"
                name="fence_color"
                options={FENCE_COLORS}
                placeholder="Farbe wählen"
                value={fenceColor}
                onChange={setFenceColor}
              />
            </FieldGrid>
            {fenceType === "andere" && (
              <TextField
                label="Andere Zaunart"
                name="fence_type_other"
                placeholder="Bitte beschreiben"
              />
            )}
            {fenceColor === "andere" && (
              <TextField
                label="Andere Farbe"
                name="fence_color_other"
                placeholder="Bitte beschreiben"
              />
            )}
          </>
        ) : (
          <FieldGrid>
            <TextField label="Installationsdatum" name="installation_date" type="date" />
            <TextField
              label="Zaun-/Systembezeichnung"
              name="system_label"
              placeholder="z. B. Modell / Hersteller"
            />
          </FieldGrid>
        )}

        <FieldGrid>
          <TextField
            label="Zaunhöhe in Zentimetern"
            name="fence_height_cm"
            type="number"
            inputMode="numeric"
            min={0}
          />
          <TextField
            label="Zaunlänge in Metern"
            name="fence_length_m"
            type="number"
            inputMode="numeric"
            min={0}
          />
        </FieldGrid>

        {isComparison && (
          <TextField
            label="Ungefähres Alter des Zauns"
            name="fence_age"
            placeholder="z. B. rund 3 Jahre"
          />
        )}

        <FieldGrid>
          <TextField
            label="Nutztierart(en)"
            name="livestock_types"
            placeholder="z. B. Schafe, Ziegen"
          />
          <TextField
            label="Anzahl geschützter Nutztiere (ungefähr)"
            name="livestock_count"
            type="number"
            inputMode="numeric"
            min={0}
          />
        </FieldGrid>
      </FormSection>

      <FormSection
        title="Beobachtungszeitraum"
        description="Diese Angaben sind wichtig, damit sich verschiedene Zaunsysteme später vergleichen lassen."
      >
        <FieldGrid>
          <TextField label="Von" name="observation_from" type="date" />
          <TextField label="Bis" name="observation_to" type="date" />
        </FieldGrid>
        <TextField
          label="Betriebstage (ungefähr)"
          name="operating_days"
          type="number"
          inputMode="numeric"
          min={0}
          hint="Tage, an denen der Zaun in diesem Zeitraum tatsächlich in Betrieb war."
        />
      </FormSection>

      <FormSection title="Verhedderungen von Wildtieren">
        <YesNoField
          label="Kam es im angegebenen Zeitraum zu Verhedderungen von Wildtieren?"
          name="entanglement_occurred"
          value={entanglement}
          onChange={setEntanglement}
        />
        {entanglement === true && (
          <>
            <TextField
              label="Anzahl Ereignisse"
              name="entanglement_event_count"
              type="number"
              inputMode="numeric"
              min={0}
            />
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                Betroffene Wildtiere
              </p>
              <p className="text-xs text-muted-foreground">
                Tierart, Anzahl und Ausgang je Ereignis – mehrere Einträge
                möglich.
              </p>
              <div className="pt-1">
                <EntanglementRows name="entanglement_events" />
              </div>
            </div>
          </>
        )}
      </FormSection>

      <FormSection title="Wolfsrisse">
        <YesNoField
          label="Kam es im angegebenen Zeitraum zu Wolfsrissen innerhalb der geschützten Fläche?"
          name="wolf_attack_occurred"
          value={wolf}
          onChange={setWolf}
        />
        {wolf === true && (
          <>
            <FieldGrid>
              <TextField
                label="Anzahl Ereignisse"
                name="wolf_attack_event_count"
                type="number"
                inputMode="numeric"
                min={0}
              />
              <div />
            </FieldGrid>
            <FieldGrid>
              <TextField
                label="Anzahl verletzte Nutztiere"
                name="wolf_injured_livestock"
                type="number"
                inputMode="numeric"
                min={0}
              />
              <TextField
                label="Anzahl getötete Nutztiere"
                name="wolf_killed_livestock"
                type="number"
                inputMode="numeric"
                min={0}
              />
            </FieldGrid>
            <TextareaField label="Bemerkung" name="wolf_note" rows={3} />
          </>
        )}
      </FormSection>

      {!isComparison && (
        <FormSection title="Wartung">
          <SegmentedField
            label="Wurde der Zaun während des Berichtszeitraums regelmässig kontrolliert und die Umgebung entsprechend gepflegt?"
            name="maintenance"
            options={MAINTENANCE_OPTIONS}
          />
          <TextareaField label="Bemerkung" name="maintenance_note" rows={3} />
        </FormSection>
      )}

      <FormSection
        title="Bilder"
        description="Bilder werden vertraulich gespeichert und nicht automatisch veröffentlicht."
      >
        <ImageUploader
          folder="fence"
          hint={
            isComparison
              ? "Bis zu 5 Bilder (JPEG, PNG, WebP, HEIC), max. 10 MB pro Bild."
              : "Mindestens ein Bild ist erwünscht, aber nicht zwingend. Bis zu 5 Bilder, max. 10 MB pro Bild."
          }
        />
      </FormSection>

      <ConsentFields withImageConsent />

      <div className="space-y-4">
        <FormError message={state.message} />
        <SubmitButton label="Rückmeldung absenden" pending={pending} />
      </div>
    </form>
  );
}
