import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import type { Project } from "@/lib/types";
import { getProjects, getProjectStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projekte",
  description:
    "Unsere Projekte für Schweizer Wildtiere: wildtierschonende Weidezäune, WILDSEEK, Biodiversitätsinseln und weitere Vorhaben.",
  alternates: { canonical: "/projekte" },
};

export default async function ProjektePage() {
  const [projects, stats] = await Promise.all([getProjects(), getProjectStats()]);

  const statBySlug = new Map((stats?.entries ?? []).map((e) => [e.slug, e]));
  const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
  const mainSlugs = (stats?.entries ?? [])
    .filter((e) => e.is_main)
    .map((e) => e.slug);

  const mainProjects = mainSlugs
    .map((s) => projectBySlug.get(s))
    .filter((p): p is Project => Boolean(p));
  const otherProjects = projects.filter((p) => !mainSlugs.includes(p.slug));

  return (
    <>
      <PageHero
        eyebrow="Was wir tun"
        title="Projekte"
        lead="Konkrete, praxisnahe Massnahmen für den Schutz von Wildtieren und ihrer Lebensräume in der Schweiz."
      />
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">
            Zurzeit sind keine Projekte veröffentlicht.
          </p>
        ) : (
          <>
            {mainProjects.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                  Aktuelle Hauptprojekte
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mainProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {otherProjects.length > 0 && (
              <section className="mt-16 border-t border-border/70 pt-14">
                <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                  Weitere &amp; frühere Projekte
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Projekte, die pausiert sind oder in anderer Form fortgeführt
                  werden – weiterhin dokumentiert.
                </p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      stat={statBySlug.get(project.slug)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
