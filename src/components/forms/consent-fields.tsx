import Link from "next/link";
import { CheckboxField } from "./fields";

// Pflicht: Hinweis zur Datenverarbeitung + erforderliche Bestätigung.
// Separat & freiwillig: Einwilligung zur Veröffentlichung hochgeladener Bilder
// (nur bei Formularen mit Bildupload). Die Veröffentlichungs-Einwilligung ist
// nie Voraussetzung zum Absenden.
export function ConsentFields({
  withImageConsent = false,
}: {
  withImageConsent?: boolean;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border/70 bg-secondary/30 p-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Die übermittelten Angaben{withImageConsent ? " und Bilder" : ""} werden
        zur Projektdokumentation, Auswertung und Weiterentwicklung unserer
        Projekte verwendet. Wie wir mit Ihren Daten umgehen, beschreibt unsere{" "}
        <Link
          href="/datenschutz"
          target="_blank"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Datenschutzerklärung
        </Link>
        .
      </p>

      <CheckboxField name="data_consent" required>
        Ich bestätige, dass meine Angaben gemäss der Datenschutzerklärung
        verarbeitet werden dürfen.
        <span className="text-destructive"> *</span>
      </CheckboxField>

      {withImageConsent && (
        <CheckboxField name="image_publish_consent">
          Ich bin damit einverstanden, dass von mir hochgeladene Bilder durch
          den Verein Schutz von Wildtieren für die Website, Projektberichte,
          Förderberichte und die Öffentlichkeitsarbeit verwendet werden dürfen.
          <span className="text-muted-foreground"> (freiwillig)</span>
        </CheckboxField>
      )}
    </div>
  );
}
