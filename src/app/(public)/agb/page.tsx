import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen des Vereins Schutz von Wildtieren.",
};

export default function AgbPage() {
  return (
    <>
      <PageHero title="Allgemeine Geschäftsbedingungen" />
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 rounded-2xl border border-accent/30 bg-accent/[0.07] p-5 text-sm text-foreground">
          <p className="font-medium">Hinweis zu diesem Dokument</p>
          <p className="mt-2 text-muted-foreground">
            Dieser Text wurde unverändert inhaltlich von der bisherigen Website
            des Vereins übernommen. Einzelne Klauseln (z.&nbsp;B. zu
            Diskussionsforen oder zur Online-Registrierung neuer Mitglieder)
            beziehen sich auf Funktionen, die auf dieser Website aktuell nicht
            angeboten werden. Der Verein sollte diesen Text von einer
            fachkundigen Stelle prüfen und aktualisieren lassen. [Information
            muss ergänzt oder bestätigt werden]
          </p>
        </div>

        <div className="prose-legal space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              1. Nutzung der Webseite
            </h2>
            <p className="mt-2">
              1.1 Diese AGB gelten für die Mitglieder des Vereins «Schutz von
              Wildtieren» sowie für sonstige Nutzerinnen, Nutzer und Besuchende
              der Webseite.
            </p>
            <p className="mt-2">
              1.2 Auf Wunsch können Mitglieder des Vereins ihre Daten auf der
              Webseite publizieren.
            </p>
            <p className="mt-2">
              1.3 Eine Registrierung als Neumitglied des Vereins über die
              Webseite ist grundsätzlich möglich.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              2. Finanzen
            </h2>
            <p className="mt-2">
              2.1 Die Gebühren für die Mitgliedschaft werden jährlich
              verrechnet. Die Abrechnung wird per E-Mail zugestellt. Die
              Registrierung als Mitglied erfolgt, sobald die erste Gebühr
              bezahlt ist.
            </p>
            <p className="mt-2">
              2.2 Die Gebühren können mit den vorgegebenen Zahlungsmethoden
              bezahlt werden. Mitglieder entscheiden sich beim
              Mitgliedschaftsantrag verbindlich für einen der genannten
              Zahlungswege.
            </p>
            <p className="mt-2">
              2.3 Kosten im Zusammenhang mit dem Zahlungsverfahren, z.&nbsp;B.
              Bankgebühren, tragen die Mitglieder.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              3. Mitglieder &amp; Sponsoren
            </h2>
            <p className="mt-2">
              3.1 Mitglieder und Sponsoren können auf Wunsch auf der Webseite
              angezeigt werden.
            </p>
            <p className="mt-2">
              3.2 Mitglieder und Sponsoren können ihre Daten jederzeit über
              ein Vorstandsmitglied veröffentlichen oder entfernen lassen.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              4. Haftung
            </h2>
            <p className="mt-2">
              4.1 Mitglieder und sonstige Besuchende der Webseite sind sich
              bewusst, dass sich auch bei sorgfältiger Softwareentwicklung und
              Wartung Fehler einschleichen können, sodass der Verein nicht für
              eine hundertprozentige Verfügbarkeit der Dienstleistung
              einstehen kann.
            </p>
            <p className="mt-2">
              4.2 Aus Wartungs-, Sicherheits- oder Kapazitätsgründen können die
              Dienstleistungen kurzzeitig ausgesetzt oder beschränkt werden.
              Bei vorhersehbaren Unterbrüchen findet sich eine entsprechende
              Information auf der Website.
            </p>
            <p className="mt-2">
              4.3 Der Verein beschränkt seine Haftung auf Schäden, die auf
              vorsätzliche Vertragsverletzungen oder grobe bzw. mittlere
              Fahrlässigkeit der für die Webseite zuständigen
              Vorstandsmitglieder oder ihrer Hilfspersonen zurückzuführen
              sind. Mängel und Störungen sind unverzüglich mitzuteilen.
            </p>
            <p className="mt-2">
              4.4 Der Verein haftet nicht für Mängel und Störungen, die er
              nicht zu vertreten hat, insbesondere nicht für Sicherheitsmängel
              und Betriebsausfälle von Drittunternehmen, mit denen er
              zusammenarbeitet oder von denen er abhängig ist.
            </p>
            <p className="mt-2">
              4.5 Der Verein haftet nicht für höhere Gewalt, unsachgemässes
              Vorgehen und Missachtung von Risiken seitens der Mitglieder oder
              Dritter, übermässige Beanspruchung, ungeeignete Betriebsmittel,
              extreme Umgebungseinflüsse, Eingriffe der Mitglieder oder
              Störungen durch Dritte (Viren, Würmer usw.), die trotz
              notwendiger, aktueller Sicherheitsvorkehrungen auftreten.
            </p>
            <p className="mt-2">
              4.6 Der Verein haftet nicht für Pflichtverletzungen eines
              Mitglieds gegenüber einem anderen Mitglied aufgrund von zwischen
              diesen geschlossenen Vereinbarungen. Mitglieder sind für ihre
              Kommunikation untereinander selbst verantwortlich.
            </p>
            <p className="mt-2">
              4.7 Der Verein übernimmt keine Haftung gegenüber Mitgliedern für
              direkte oder indirekte Schäden, die durch die Nutzung und den
              Inhalt der über die Plattform publizierten Informationen oder
              deren Übertragung im Internet entstehen.
            </p>
            <p className="mt-2">
              4.8 Die Authentifizierung von Internetnutzenden kann nicht
              absolut gewährleistet werden, auch wenn Angaben vor der
              Registrierung überprüft werden. Wer über die Webseite Kontakt
              mit anderen Personen aufnimmt, sollte sich selbst von deren
              Identität überzeugen.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              5. Datenschutz und Verarbeitung von Daten
            </h2>
            <p className="mt-2">
              5.1 Der Verein verpflichtet sich, die Regelungen des
              schweizerischen Datenschutzgesetzes und der
              Datenschutzverordnung zu beachten. Einzelheiten finden sich in
              der{" "}
              <a href="/datenschutz" className="underline underline-offset-4">
                Datenschutzerklärung
              </a>
              .
            </p>
            <p className="mt-2">
              5.2 Mitglieder überlassen dem Verein alle für die
              vertragsgemässen Dienstleistungen erforderlichen Angaben und
              gewährleisten, dass diese wahr und vollständig sind.
              Adressänderungen und weitere notwendige Informationen sind
              unverzüglich mitzuteilen.
            </p>
            <p className="mt-2">
              5.3 Personenbezogene Daten der Mitglieder (z.&nbsp;B. Name,
              E-Mail-Adresse) werden ausschliesslich zur Durchführung des in
              den Statuten und diesen AGB festgelegten Angebots verarbeitet.
            </p>
            <p className="mt-2">
              5.4 Bei Ausscheiden eines Mitglieds werden auf dessen Wunsch
              sämtliche Daten auf der Webseite gelöscht.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              6. Verpflichtung zu rechtmässigem Verhalten
            </h2>
            <p className="mt-2">
              6.1 Mitglieder verpflichten sich, andere Mitglieder oder
              Websitebenutzende nicht mit unerwünschten
              Kommunikationsversuchen oder Werbung zu belästigen.
            </p>
            <p className="mt-2">
              6.2 Im Umgang miteinander sind die geltenden rechtlichen
              Regelungen zu befolgen, z.&nbsp;B. keine Kettenbriefe oder
              betrügerische Angebote zu versenden.
            </p>
            <p className="mt-2">
              6.3 Auf der Plattform publizierte Daten und Informationen dürfen
              nicht gegen Persönlichkeitsrechte, Presserecht, Urheberrecht,
              Wettbewerbsrecht, Marken- und Designvorschriften sowie weitere
              schweizerische Rechtsnormen verstossen.
            </p>
            <p className="mt-2">
              6.4 Der Verein behält sich vor, die Nutzung bei gesetzeswidrigen
              oder gravierend gegen die Netiquette verstossenden
              Publikationen sofort zu sperren. Bei kriminellen Inhalten wird
              die Polizei informiert.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              7. Sicherheit
            </h2>
            <p className="mt-2">
              7.1 Der Verein sorgt in Systemen und Programmen, auf die er
              Einfluss hat, für Sicherheit nach aktuellem technischem Stand.
            </p>
            <p className="mt-2">
              7.2 Mitglieder sind für die Sicherheit der Systeme, Programme
              und Daten in ihrem eigenen Einflussbereich verantwortlich und
              sollten Passwörter geheim halten und regelmässig ändern.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              8. Änderung der AGB
            </h2>
            <p className="mt-2">
              Der Vorstand des Vereins kann diese AGB jederzeit anpassen,
              soweit es die Führung und Technik der Webseite betrifft.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
