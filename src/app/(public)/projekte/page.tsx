import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projekte",
  description:
    "Unsere Projekte für Schweizer Wildtiere: WILDSEEK, Wildsalzquellen, wildtierschonende Weidezäune, Biodiversitätsinseln und mehr.",
  alternates: { canonical: "/projekte" },
};

export default async function ProjektePage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Was wir tun"
        title="Projekte"
        lead="Konkrete, praxisnahe Massnahmen für den Schutz von Wildtieren und ihrer Lebensräume in der Schweiz."
      />
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <h2 className="sr-only">Alle Projekte</h2>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
