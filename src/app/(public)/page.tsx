import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/site/project-card";
import { HeroSlider } from "@/components/site/hero-slider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import type { Project } from "@/lib/types";
import {
  getHomeHero,
  getNews,
  getProjects,
  getProjectStats,
} from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [hero, projects, news, stats] = await Promise.all([
    getHomeHero(),
    getProjects(),
    getNews(),
    getProjectStats(),
  ]);

  const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
  const mainStats = (stats?.entries ?? []).filter((e) => e.is_main);
  const mainProjects = mainStats
    .map((s) => projectBySlug.get(s.slug))
    .filter((p): p is Project => Boolean(p));
  const latestNews = news[0] ?? null;
  const aboutImage = projectBySlug.get("biodiversitaetsinseln")?.cover_image_url;

  const introParagraphs = (hero?.intro_text ?? "").split("\n\n").filter(Boolean);

  return (
    <>
      {/* ───────────── 1 · Hero ───────────── */}
      <section className="relative flex min-h-[86svh] flex-col justify-center overflow-hidden bg-primary text-primary-foreground sm:min-h-[600px] sm:justify-end lg:min-h-[680px]">
        {hero && <HeroSlider images={hero.hero_images} />}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-primary/95 via-primary/45 to-primary/10 sm:bg-gradient-to-tr sm:from-primary/90 sm:via-primary/40 sm:to-transparent"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-12 text-center sm:items-start sm:px-6 sm:pb-28 sm:pt-24 sm:text-left lg:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e4c78a]">
            <span className="hidden h-px w-6 bg-current opacity-70 sm:inline-block" />
            Schweizer Wildtierschutz
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-[2.35rem] font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            {hero?.headline ?? "Gemeinsam für die Natur und unsere Wildtiere."}
          </h1>
          {hero?.subline && (
            <p className="mt-5 max-w-xl text-balance text-base text-primary-foreground/85 sm:text-lg">
              {hero.subline}
            </p>
          )}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={hero?.primary_cta_href ?? "/projekte"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full justify-center bg-white text-primary hover:bg-white/90 sm:w-auto"
              )}
            >
              {hero?.primary_cta_label ?? "Unsere Projekte"}
            </Link>
            <Link
              href={hero?.secondary_cta_href ?? "/unterstuetzen"}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full justify-center border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
              )}
            >
              {hero?.secondary_cta_label ?? "Jetzt unterstützen"}
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── 2 · Wirkung (offene Kennzahlen, keine Cards) ───────────── */}
      {mainStats.length > 0 && (
        <Reveal>
          <section className="border-b border-border/70 bg-secondary/25 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading eyebrow="Wirkung" title="Unsere Wirkung in Zahlen" />
                <Link
                  href="/erfolge"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
                >
                  Unsere Wirkung entdecken
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <dl className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-border/70">
                {mainStats.map((s, i) => (
                  <div
                    key={s.slug}
                    className={cn(
                      "sm:px-8",
                      i === 0 && "sm:pl-0",
                      i === mainStats.length - 1 && "sm:pr-0"
                    )}
                  >
                    <dt className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                      {s.metric_value}
                      <span className="ml-1.5 text-xl font-semibold text-primary/80 sm:text-2xl">
                        {s.metric_unit}
                      </span>
                    </dt>
                    <dd className="mt-2 text-sm text-muted-foreground">
                      {projectBySlug.get(s.slug)?.title ?? s.slug}
                      {s.metric_label ? ` – ${s.metric_label}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </Reveal>
      )}

      {/* ───────────── 3 · Unsere Projekte ───────────── */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Was wir tun"
              title="Unsere Projekte"
              description="Drei laufende Hauptprojekte für Schweizer Wildtiere und ihre Lebensräume."
            />
            <Link
              href="/projekte"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
            >
              Alle Projekte
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {mainProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* ───────────── 4 · Über den Verein (Text + Bild, keine Card) ───────────── */}
      {introParagraphs.length > 0 && (
        <Reveal>
          <section className="border-y border-border/70 bg-secondary/25 py-20 sm:py-28">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
              <div>
                <SectionHeading
                  eyebrow="Über uns"
                  title={hero?.intro_title ?? "Über den Verein"}
                />
                <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {introParagraphs.slice(0, 2).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <Link
                  href="/verein"
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
                >
                  Mehr über uns
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              {aboutImage && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted lg:aspect-[5/4]">
                  <Image
                    src={aboutImage}
                    alt="Ein Projekt des Vereins Schutz von Wildtieren"
                    fill
                    quality={82}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* ───────────── 5 · Aktuelles / Presse (editorial) ───────────── */}
      {latestNews && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Aktuelles / Presse" title="Aktuelles" />
              <Link
                href="/aktuelles"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
              >
                Alle Beiträge
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <article className="mt-10 grid items-center gap-8 border-t border-border pt-10 sm:grid-cols-[1.1fr_1fr] sm:gap-12">
              <div>
                {latestNews.date_label && (
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                    {latestNews.date_label}
                  </span>
                )}
                <h3 className="mt-2 text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
                  {latestNews.title}
                </h3>
                {latestNews.summary && (
                  <p className="mt-3 line-clamp-3 text-muted-foreground">
                    {latestNews.summary}
                  </p>
                )}
                <Link
                  href={`/aktuelles/${latestNews.slug}`}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
                >
                  Weiterlesen
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              {latestNews.cover_image_url && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted sm:order-last">
                  <Image
                    src={latestNews.cover_image_url}
                    alt={latestNews.title}
                    fill
                    quality={82}
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </article>
          </section>
        </Reveal>
      )}

      {/* ───────────── 6 · Unterstützen (voller Abschluss-Band) ───────────── */}
      <Reveal>
        <section className="bg-primary py-20 text-primary-foreground sm:py-28">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
            <p className="eyebrow eyebrow-center text-[#e4c78a]">Unterstützen</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Gemeinsam können wir mehr bewirken.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Mit Ihrer Unterstützung finanzieren wir konkrete Projekte für
              Schweizer Wildtiere und ihre Lebensräume – jeder Beitrag zählt.
            </p>
            <Link
              href="/unterstuetzen"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 bg-white text-primary hover:bg-white/90"
              )}
            >
              Jetzt unterstützen
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
