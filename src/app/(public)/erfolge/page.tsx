import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { getErfolgeIntro, getProjects, getSuccessEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erfolge",
  description:
    "Konkrete Ergebnisse unserer Projekte für Schweizer Wildtiere, nach Projekt und Zeitraum.",
  alternates: { canonical: "/erfolge" },
};

export default async function ErfolgePage() {
  const [intro, entries, projects] = await Promise.all([
    getErfolgeIntro(),
    getSuccessEntries(),
    getProjects(),
  ]);

  const byProject = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = entry.project_slug ?? "allgemein";
    if (!byProject.has(key)) byProject.set(key, []);
    byProject.get(key)!.push(entry);
  }

  const projectTitle = (slug: string) =>
    projects.find((p) => p.slug === slug)?.title ?? slug;

  return (
    <>
      <PageHero
        eyebrow="Wirkung"
        title="Erfolge"
        lead="Was wir mit Ihrer Unterstützung bisher konkret erreicht haben."
      />

      {intro && intro.kantone.length > 0 && (
        <section className="border-b border-border/70 bg-muted/50 py-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-5 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-muted-foreground">
              Bereits aktiv in:
            </p>
            <div className="flex flex-wrap gap-2">
              {intro.kantone.map((kanton) => (
                <span
                  key={kanton}
                  className="rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-sm font-medium text-foreground shadow-card"
                >
                  {kanton}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        {byProject.size === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="space-y-14">
            {Array.from(byProject.entries()).map(([slug, projectEntries]) => (
              <Reveal key={slug}>
                <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                  {projectTitle(slug)}
                </h2>
                <ol className="mt-5 border-l-2 border-border pl-6">
                  {projectEntries.map((entry) => (
                    <li key={entry.id} className="relative pb-6 last:pb-0">
                      <span
                        className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-brand ring-4 ring-background"
                        aria-hidden="true"
                      />
                      {entry.period_label && (
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {entry.period_label}
                        </p>
                      )}
                      <p className="mt-0.5 font-medium text-foreground">
                        {entry.value_label}
                      </p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
