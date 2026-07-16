import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { getKontakt, getVerein } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Schutz von Wildtieren.",
};

export default async function ImpressumPage() {
  const [kontakt, verein] = await Promise.all([getKontakt(), getVerein()]);

  return (
    <>
      <PageHero title="Impressum" />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-20 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:py-24 lg:px-8">
        <div className="rounded-2xl border border-accent/30 bg-accent/[0.07] p-5 text-foreground">
          <p className="font-medium">Hinweis zu diesem Dokument</p>
          <p className="mt-2 text-muted-foreground">
            Auf der bisherigen Website des Vereins war kein Impressum
            vorhanden. Diese Seite wurde für die neue Website neu erstellt.
            Vereinsregister- oder UID-Nummer liegen uns nicht vor.
            [Information muss ergänzt oder bestätigt werden]
          </p>
        </div>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Verantwortlich für den Inhalt
          </h2>
          {kontakt && (
            <p className="mt-2">
              Verein Schutz von Wildtieren
              <br />
              {kontakt.strasse}
              <br />
              {kontakt.ort}
              <br />
              Schweiz
            </p>
          )}
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Vertreten durch
          </h2>
          <p className="mt-2">
            {verein?.founder_name ?? "[Information muss ergänzt oder bestätigt werden]"}
            {verein?.founder_role ? `, ${verein.founder_role}` : ""}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Kontakt
          </h2>
          {kontakt && (
            <p className="mt-2">
              {kontakt.telefon && (
                <>
                  Telefon: {kontakt.telefon}
                  <br />
                </>
              )}
              E-Mail: {kontakt.email}
            </p>
          )}
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Vereinsregister
          </h2>
          <p className="mt-2">[Information muss ergänzt oder bestätigt werden]</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Haftungsausschluss
          </h2>
          <p className="mt-2">
            Wir bemühen uns um Richtigkeit und Aktualität der auf dieser
            Website veröffentlichten Informationen, können jedoch keine
            Gewähr dafür übernehmen. Weitere Einzelheiten regeln unsere{" "}
            <a href="/agb" className="underline underline-offset-4">
              AGB
            </a>
            .
          </p>
        </section>
      </article>
    </>
  );
}
