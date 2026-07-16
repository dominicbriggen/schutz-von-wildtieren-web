import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { getKontakt } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Schutz von Wildtieren.",
};

export default async function DatenschutzPage() {
  const kontakt = await getKontakt();

  return (
    <>
      <PageHero title="Datenschutzerklärung" />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-20 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:py-24 lg:px-8">
        <div className="rounded-2xl border border-accent/30 bg-accent/[0.07] p-5 text-foreground">
          <p className="font-medium">Hinweis zu diesem Dokument</p>
          <p className="mt-2 text-muted-foreground">
            Auf der bisherigen Website des Vereins war keine eigenständige
            Datenschutzerklärung vorhanden. Dieser Text wurde für die neue
            Website neu erstellt und beschreibt, wie diese Website tatsächlich
            funktioniert. Er ersetzt keine Rechtsberatung; einzelne Angaben
            zum Verein sollten von einer fachkundigen Stelle geprüft werden.
            [Information muss ergänzt oder bestätigt werden]
          </p>
        </div>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            1. Verantwortliche Stelle
          </h2>
          <p className="mt-2">
            Verein Schutz von Wildtieren
            {kontakt && (
              <>
                <br />
                {kontakt.strasse}
                <br />
                {kontakt.ort}
                <br />
                {kontakt.email}
              </>
            )}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            2. Grundsätze
          </h2>
          <p className="mt-2">
            Wir bearbeiten Personendaten im Einklang mit dem schweizerischen
            Datenschutzgesetz (DSG) und der Datenschutzverordnung (DSV). Wir
            erheben nur Daten, die für den jeweiligen Zweck erforderlich sind
            (Datensparsamkeit), verwenden sie ausschliesslich für den Zweck,
            zu dem sie erhoben wurden (Zweckbindung), und informieren
            transparent darüber, was mit Ihren Daten geschieht.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            3. Hosting und technische Infrastruktur
          </h2>
          <p className="mt-2">
            Diese Website wird bei Vercel Inc. (USA) gehostet und ausgeliefert.
            Datenbank, Authentifizierung und Bildspeicher werden über Supabase
            betrieben, mit einer Datenbankregion in Zürich (Schweiz/EU).
            Beim Aufruf der Website werden durch die Hosting-Infrastruktur
            technisch notwendige Zugriffsdaten (z.&nbsp;B. IP-Adresse,
            Zeitpunkt des Zugriffs) kurzzeitig verarbeitet, um die Website
            sicher und stabil auszuliefern. Diese Daten werden nicht für
            Analyse- oder Marketingzwecke ausgewertet.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            4. Cookies und Tracking
          </h2>
          <p className="mt-2">
            Diese Website verwendet keine Analyse-, Marketing- oder
            Tracking-Cookies. Es werden ausschliesslich technisch notwendige
            Cookies eingesetzt, um eine angemeldete Sitzung im geschützten
            Verwaltungsbereich (<code>/admin</code>) aufrechtzuerhalten. Diese
            Cookies werden nur gesetzt, wenn sich eine berechtigte Person am
            Verwaltungsbereich anmeldet, nicht bei einem gewöhnlichen Besuch
            der öffentlichen Website.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            5. Kontaktformular
          </h2>
          <p className="mt-2">
            Wenn Sie unser Kontaktformular nutzen, speichern wir die von Ihnen
            angegebenen Daten (Name, E-Mail-Adresse, Nachricht), um Ihre
            Anfrage zu bearbeiten und Ihnen zu antworten. Diese Daten werden
            ausschliesslich für diesen Zweck verwendet und nicht an Dritte
            weitergegeben.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            6. Schriftarten
          </h2>
          <p className="mt-2">
            Die auf dieser Website verwendeten Schriftarten werden lokal
            ausgeliefert und beim Seitenaufruf nicht von externen Servern
            nachgeladen.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            7. Ihre Rechte
          </h2>
          <p className="mt-2">
            Sie haben das Recht, Auskunft über die von uns bearbeiteten
            Personendaten zu verlangen sowie deren Berichtigung oder Löschung
            zu beantragen, soweit keine gesetzlichen Aufbewahrungspflichten
            entgegenstehen. Wenden Sie sich dazu an die oben genannte
            Kontaktadresse.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            8. Änderungen
          </h2>
          <p className="mt-2">
            Wir passen diese Datenschutzerklärung an, sobald sich die
            Funktionen dieser Website oder die rechtlichen Anforderungen
            ändern.
          </p>
        </section>
      </article>
    </>
  );
}
