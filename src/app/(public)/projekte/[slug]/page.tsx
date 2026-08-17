import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProseText } from "@/components/site/prose-text";
import { ProjectStatusBadge } from "@/components/site/project-status-badge";
import { SectionHeading } from "@/components/site/section-heading";
import {
  findProjectStat,
  getGalleryImages,
  getProjectBySlug,
  getProjectStats,
  getSuccessEntries,
} from "@/lib/content";
import { createStaticClient } from "@/lib/supabase/static";

// Kontrollierte Hero-Bildgrösse je Projekt – niemals über die native Auflösung
// hinaus vergrössern. Hochformatige Bilder (Weidezaun) bleiben schmal, damit
// sie scharf bleiben; Querformate nutzen die volle Hero-Breite (~600px).
const HERO_CONFIG: Record<
  string,
  { aspect: string; maxW: string; sizes: string }
> = {
  "wildtierschonender-weidezaun": {
    aspect: "aspect-[4/5]",
    maxW: "lg:max-w-[360px]",
    sizes: "(min-width: 1024px) 360px, (min-width: 640px) 60vw, 100vw",
  },
  wildseek: {
    aspect: "aspect-[4/3]",
    maxW: "lg:max-w-[600px]",
    sizes: "(min-width: 1024px) 600px, 100vw",
  },
  biodiversitaetsinseln: {
    aspect: "aspect-[4/3]",
    maxW: "lg:max-w-[600px]",
    sizes: "(min-width: 1024px) 600px, 100vw",
  },
};
const DEFAULT_HERO = {
  aspect: "aspect-[4/3]",
  maxW: "lg:max-w-[560px]",
  sizes: "(min-width: 1024px) 560px, 100vw",
};

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? undefined,
    alternates: { canonical: `/projekte/${project.slug}` },
  };
}

export default async function ProjektDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, successEntries, stats, gallery] = await Promise.all([
    getProjectBySlug(slug),
    getSuccessEntries(),
    getProjectStats(),
    getGalleryImages(),
  ]);

  if (!project) notFound();

  const stat = findProjectStat(stats, project.slug);
  const results = successEntries.filter((e) => e.project_slug === project.slug);
  const heroCfg = HERO_CONFIG[project.slug] ?? DEFAULT_HERO;

  // „Einblicke": authentische Projektbilder (ohne das Hero-Bild), dedupliziert.
  const einblicke = project.images
    .filter((url) => url !== project.cover_image_url)
    .filter((url, i, arr) => arr.indexOf(url) === i)
    .slice(0, 6);
  const hasGallery = gallery.length > 0;

  return (
    <>
      {project.status !== "published" && (
        <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
          Vorschau — dieser Beitrag ist noch nicht veröffentlicht und nur für Sie als Administrator sichtbar.
        </div>
      )}

      {/* ───────── A · Projekt-Hero (zweispaltig, kontrollierte Bildgrösse) ───────── */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow">Projekt</p>
            <h1 className="mt-3 text-[2.25rem] font-bold leading-[1.1] text-primary sm:text-5xl">
              {project.title}
            </h1>
            {project.summary && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
            )}
            {stat && stat.status !== "aktiv" && (
              <ProjectStatusBadge stat={stat} className="mt-5" />
            )}
            {stat?.metric_value && (
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {stat.metric_value}
                  <span className="ml-1.5 text-xl font-semibold text-primary/80">
                    {stat.metric_unit}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.metric_label}
                  {stat.as_of ? ` · Stand ${stat.as_of}` : ""}
                </p>
              </div>
            )}
            <div className="mt-8">
              <Link
                href="/unterstuetzen"
                className={cn(buttonVariants({ variant: "brand" }))}
              >
                Dieses Projekt unterstützen
              </Link>
            </div>
          </div>

          {project.cover_image_url && (
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-xl bg-muted lg:justify-self-end",
                heroCfg.aspect,
                heroCfg.maxW
              )}
            >
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                priority
                quality={85}
                sizes={heroCfg.sizes}
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* ───────── B/C · Projekttext (editorial, keine Cards) ───────── */}
      {project.body && (
        <section className="border-t border-border/70 bg-secondary/20 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
            <ProseText text={project.body} />
          </div>
        </section>
      )}

      {/* ───────── D · Wirkung (zentrale Kennzahl, offene Fläche) ───────── */}
      {stat?.is_main && stat.metric_value && (
        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
            <p className="eyebrow eyebrow-center text-[#e4c78a]">Wirkung</p>
            <p className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
              {stat.metric_value}
              <span className="ml-2 text-2xl font-semibold text-primary-foreground/75 sm:text-3xl">
                {stat.metric_unit}
              </span>
            </p>
            <p className="mt-2 text-primary-foreground/75">
              {stat.metric_label}
              {stat.as_of ? ` · Stand ${stat.as_of}` : ""}
            </p>
            {stat.notes && stat.notes.length > 0 && (
              <ul className="mx-auto mt-5 flex max-w-xl flex-col gap-1 text-sm text-primary-foreground/70">
                {stat.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Entwicklung seit Projektbeginn (historische Zahlen, dezent) */}
      {results.length > 1 && (
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="text-lg font-semibold text-primary sm:text-xl">
            Entwicklung seit Projektbeginn
          </h2>
          <ol className="mt-5 border-l-2 border-border pl-6">
            {results.map((entry) => (
              <li key={entry.id} className="relative pb-5 last:pb-0">
                <span
                  className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-brand ring-4 ring-background"
                  aria-hidden="true"
                />
                {entry.period_label && (
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {entry.period_label}
                  </p>
                )}
                <p className="text-sm font-medium text-foreground">
                  {entry.value_label}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ───────── E · Einblicke aus dem Projekt ───────── */}
      {einblicke.length > 0 && (
        <section className="border-t border-border/70 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Bilder" title="Einblicke aus dem Projekt" />
              {hasGallery && (
                <Link
                  href="/bilder"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
                >
                  Mehr Bilder in der Galerie
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {einblicke.map((url, i) => (
                <div
                  key={url}
                  className={cn(
                    "relative overflow-hidden rounded-lg bg-muted",
                    i === 0
                      ? "col-span-2 row-span-2 aspect-square"
                      : "aspect-square"
                  )}
                >
                  <Image
                    src={url}
                    alt={`${project.title} – Einblick ${i + 1}`}
                    fill
                    quality={80}
                    sizes={
                      i === 0
                        ? "(min-width: 640px) 50vw, 100vw"
                        : "(min-width: 640px) 25vw, 50vw"
                    }
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── G · Unterstützen ───────── */}
      <section className="border-t border-border/70 bg-secondary/30 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
            Dieses Projekt unterstützen
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Mit Ihrer Spende helfen Sie mit, dieses Projekt weiterzuführen und
            schweizweit auszubauen – jeder Beitrag zählt.
          </p>
          <Link
            href="/unterstuetzen"
            className={cn(buttonVariants({ variant: "brand", size: "lg" }), "mt-7")}
          >
            Jetzt unterstützen
          </Link>
        </div>
      </section>
    </>
  );
}
