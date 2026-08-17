"use client";

import { useActionState, useState } from "react";
import {
  submitProjectInterest,
  type MitmachenFormState,
} from "@/lib/actions/mitmachen";
import { CANTONS, PROJECT_INTEREST_OPTIONS } from "@/lib/forms/constants";
import {
  FormSection,
  FieldGrid,
  TextField,
  TextareaField,
  NativeSelectField,
  FormError,
  SubmitButton,
} from "@/components/forms/fields";
import { ConsentFields } from "@/components/forms/consent-fields";
import { SpamGuardFields } from "@/components/forms/spam-guard";
import { SuccessPanel } from "@/components/forms/success-panel";

const initial: MitmachenFormState = { status: "idle" };

export function InterestForm() {
  const [state, action, pending] = useActionState(submitProjectInterest, initial);
  const [interest, setInterest] = useState("");

  if (state.status === "success") {
    return (
      <SuccessPanel title="Vielen Dank für Ihr Interesse.">
        Ihre Angaben wurden erfolgreich übermittelt. Wir melden uns bei Ihnen,
        sobald eine Teilnahme am entsprechenden Projekt möglich ist.
      </SuccessPanel>
    );
  }

  const showWildseek = interest === "wildseek" || interest === "beide";
  const showFence = interest === "weidezaun" || interest === "beide";

  return (
    <form action={action} className="space-y-10" noValidate>
      <SpamGuardFields />

      <FormSection title="Auswahl">
        <NativeSelectField
          label="Für welches Projekt interessieren Sie sich?"
          name="project_interest"
          required
          options={PROJECT_INTEREST_OPTIONS}
          placeholder="Projekt wählen"
          value={interest}
          onChange={setInterest}
        />
      </FormSection>

      <FormSection title="Kontaktdaten">
        <TextField label="Betrieb" name="organization" autoComplete="organization" />
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
        <TextField label="Adresse" name="address" autoComplete="street-address" />
        <FieldGrid>
          <TextField
            label="PLZ"
            name="postal_code"
            inputMode="numeric"
            autoComplete="postal-code"
          />
          <TextField label="Ort" name="city" autoComplete="address-level2" />
        </FieldGrid>
        <NativeSelectField
          label="Kanton"
          name="canton"
          required
          options={CANTONS}
          placeholder="Kanton wählen"
        />
      </FormSection>

      {(showWildseek || showFence) && (
        <FormSection title="Bedarf">
          {showWildseek && (
            <>
              <TextareaField
                label="Kurze Beschreibung des Einsatzbedarfs (WILDSEEK)"
                name="wildseek_need"
                rows={4}
                placeholder="Wozu möchten Sie WILDSEEK einsetzen?"
              />
              <TextField
                label="Ungefähr bewirtschaftete Fläche"
                name="wildseek_area"
                placeholder="z. B. rund 12 Hektaren"
              />
            </>
          )}
          {showFence && (
            <>
              <FieldGrid>
                <TextField
                  label="Benötigte Zaunlänge (ungefähr, in Metern)"
                  name="fence_length_m"
                  type="number"
                  inputMode="numeric"
                  min={0}
                />
                <TextField
                  label="Nutztierart(en)"
                  name="livestock_types"
                  placeholder="z. B. Schafe, Ziegen"
                />
              </FieldGrid>
              <TextareaField
                label="Kurze Beschreibung der Situation"
                name="fence_situation"
                rows={4}
              />
            </>
          )}
        </FormSection>
      )}

      <FormSection title="Weitere Bemerkungen">
        <TextareaField label="Weitere Bemerkungen" name="notes" rows={4} />
      </FormSection>

      <ConsentFields />

      <div className="space-y-4">
        <FormError message={state.message} />
        <SubmitButton label="Anfrage absenden" pending={pending} />
      </div>
    </form>
  );
}
