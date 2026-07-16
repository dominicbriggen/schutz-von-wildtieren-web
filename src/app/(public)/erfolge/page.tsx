import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { getErfolgeIntro, getProjects, getSuccessEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erfolge",
  description:
    "Konkrete Ergebnisse unserer Projekte für Schweizer Wildtiere, nach Projekt und Zeitraum.",
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
        title="Erfolge"
        lead="Was wir mit Ihrer Unterstützung bisher konkret erreicht haben."
      />

      {intro && intro.kantone.length > 0 && (
        <section className="border-b border-border bg-muted/60 py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-muted-foreground">
              Wir sind bereits in folgenden Kantonen aktiv:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {intro.kantone.map((kanton) => (
                <span
                  key={kanton}
                  className="rounded-full bg-card px-3 py-1 text-sm text-foreground shadow-sm"
                >
                  {kanton}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {byProject.size === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="space-y-14">
            {Array.from(byProject.entries()).map(([slug, projectEntries]) => (
              <div key={slug}>
                <h2 className="text-xl font-semibold text-primary">
                  {projectTitle(slug)}
                </h2>
                <ol className="mt-4 border-l-2 border-border pl-6">
                  {projectEntries.map((entry) => (
                    <li key={entry.id} className="relative pb-6 last:pb-0">
                      <span
                        className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      {entry.period_label && (
                        <p className="text-xs text-muted-foreground">
                          {entry.period_label}
                        </p>
                      )}
                      <p className="font-medium text-foreground">
                        {entry.value_label}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
