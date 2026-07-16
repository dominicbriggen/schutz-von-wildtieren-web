import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { ProseText } from "@/components/site/prose-text";
import { Reveal } from "@/components/site/reveal";
import { getVerein } from "@/lib/content";

export const metadata: Metadata = {
  title: "Verein",
  description:
    "Erfahren Sie mehr über den Verein Schutz von Wildtieren, seine Gründung, seine Ziele und die Menschen dahinter.",
  alternates: { canonical: "/verein" },
};

export default async function VereinPage() {
  const verein = await getVerein();

  if (!verein) {
    return (
      <>
        <PageHero title="Verein" />
        <p className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">
          [Information muss ergänzt oder bestätigt werden]
        </p>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title="Unsere Organisation"
        lead="Der Verein Schutz von Wildtieren wurde 2023 gegründet und setzt sich für den Schutz von Wildtieren und ihrer Lebensräume in der Schweiz ein."
      />

      <Reveal>
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
            <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full bg-muted shadow-sm ring-4 ring-background sm:w-full">
              {verein.founder_photo_url ? (
                <Image
                  src={verein.founder_photo_url}
                  alt={verein.founder_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
                  Kein Foto vorhanden
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-primary">
                {verein.founder_name}
              </h2>
              <p className="text-sm font-medium text-accent">{verein.founder_role}</p>
              <ProseText text={verein.founder_bio} className="mt-4" />
              {verein.founder_photo_note && (
                <p className="mt-4 text-sm italic text-muted-foreground">
                  {verein.founder_photo_note}
                </p>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-muted/50 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-primary">
              Die helfende Kraft
            </h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2">
              {verein.helpers.map((helper) => (
                <div key={helper.name} className="flex flex-col items-start gap-4">
                  <div className="relative size-24 overflow-hidden rounded-full bg-muted shadow-sm ring-4 ring-background">
                    {helper.photo_url ? (
                      <Image
                        src={helper.photo_url}
                        alt={helper.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Kein Foto
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {helper.name}
                    </h3>
                    <p className="text-sm font-medium text-accent">{helper.role}</p>
                    <ProseText text={helper.bio} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-semibold text-primary">
            {verein.goals_title}
          </h2>
          <ProseText text={verein.goals_text} className="mt-4" />
        </section>
      </Reveal>
    </>
  );
}
