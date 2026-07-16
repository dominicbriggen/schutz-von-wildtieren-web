import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Mail, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/site/project-card";
import { HeroSlider } from "@/components/site/hero-slider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import {
  getHomeHero,
  getKontakt,
  getNews,
  getProjects,
  getSuccessEntries,
} from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [hero, projects, news, kontakt, successEntries] = await Promise.all([
    getHomeHero(),
    getProjects(),
    getNews(),
    getKontakt(),
    getSuccessEntries(),
  ]);

  const featuredProjects = projects.slice(0, 4);
  const latestNews = news[0] ?? null;
  const highlightSuccess = successEntries.slice(-1)[0]
    ? successEntries.filter((e) => e.project_slug === "wildseek").slice(-1)
    : [];
  const weidezaunSuccess = successEntries.find(
    (e) => e.project_slug === "wildtierschonender-weidezaun"
  );
  const highlights = [...highlightSuccess, weidezaunSuccess].filter(
    (e): e is NonNullable<typeof e> => Boolean(e)
  );

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative flex min-h-[86svh] flex-col justify-center overflow-hidden bg-primary text-primary-foreground sm:min-h-[600px] sm:justify-end lg:min-h-[680px]">
        {hero && <HeroSlider images={hero.hero_images} />}
        {/* Lesbarkeits-Scrim: unten/links kräftiger, oben transparent */}
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
                "w-full justify-center bg-white text-primary shadow-lg shadow-black/20 hover:bg-white/90 sm:w-auto"
              )}
            >
              {hero?.primary_cta_label ?? "Projekte entdecken"}
            </Link>
            <Link
              href={hero?.secondary_cta_href ?? "/unterstuetzen"}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full justify-center border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:w-auto"
              )}
            >
              {hero?.secondary_cta_label ?? "Jetzt unterstützen"}
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Intro ───────────── */}
      <Reveal>
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Wer wir sind"
            title={hero?.intro_title ?? "Unser Verein"}
            className="max-w-none"
          />
          <div className="mt-6 space-y-4 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            {(hero?.intro_text ?? "").split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {hero?.quote && (
            <figure className="mt-10">
              <blockquote className="mx-auto max-w-2xl text-balance text-xl font-medium leading-snug text-primary sm:text-2xl">
                «{hero.quote}»
              </blockquote>
            </figure>
          )}
        </section>
      </Reveal>

      {/* ───────────── Projekte ───────────── */}
      <Reveal>
        <section className="border-y border-border/70 bg-muted/40 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Was wir tun"
                title="Unsere Projekte"
                description="Konkrete Vorhaben für Schweizer Wildtiere und ihre Lebensräume."
              />
              <Link
                href="/projekte"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
              >
                Alle Projekte
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ───────────── Erfolge ───────────── */}
      {highlights.length > 0 && (
        <Reveal>
          <section className="bg-primary py-20 text-primary-foreground sm:py-28">
            <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
              <SectionHeading
                tone="onPrimary"
                eyebrow="Wirkung"
                title="Konkrete Erfolge"
                description="Messbare Ergebnisse aus unseren laufenden Projekten."
              />
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {highlights.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-8 transition-standard hover:border-primary-foreground/25 hover:bg-primary-foreground/[0.09]"
                  >
                    <p className="text-sm text-primary-foreground/65">
                      {entry.title}
                      {entry.period_label ? ` · ${entry.period_label}` : ""}
                    </p>
                    <p className="mt-3 text-3xl font-bold sm:text-4xl">
                      {entry.value_label}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/erfolge"
                className="group mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e4c78a] transition-standard hover:gap-2.5"
              >
                Alle Erfolge ansehen
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </Reveal>
      )}

      {/* ───────────── Aktuelles ───────────── */}
      {latestNews && (
        <Reveal>
          <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
            <SectionHeading eyebrow="Neuigkeiten" title="Aktuelles" />
            <Link
              href={`/aktuelles/${latestNews.slug}`}
              className="group mt-12 grid gap-6 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition-standard hover:-translate-y-1 hover:shadow-card-hover sm:grid-cols-[1.1fr_1fr] sm:gap-0"
            >
              {latestNews.cover_image_url && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted sm:order-2 sm:aspect-auto sm:min-h-[320px]">
                  <Image
                    src={latestNews.cover_image_url}
                    alt={latestNews.title}
                    fill
                    quality={82}
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center gap-3 p-6 sm:order-1 sm:p-10">
                {latestNews.date_label && (
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                    {latestNews.date_label}
                  </span>
                )}
                <h3 className="text-xl font-semibold leading-snug sm:text-2xl">
                  {latestNews.title}
                </h3>
                {latestNews.summary && (
                  <p className="text-muted-foreground">{latestNews.summary}</p>
                )}
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard group-hover:gap-2.5">
                  Weiterlesen
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </section>
        </Reveal>
      )}

      {/* ───────────── Spenden-CTA ───────────── */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground shadow-elevated sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/20 blur-2xl"
            />
            <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand/20 text-[#e4c78a]">
                  <Heart className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                  So können Sie helfen
                </h2>
                <p className="mt-3 text-primary-foreground/80">
                  Mit einer Spende unterstützen Sie unsere Projekte für Schweizer
                  Wildtiere und ihre Lebensräume – jeder Beitrag zählt.
                </p>
              </div>
              <Link
                href="/unterstuetzen"
                className={cn(
                  buttonVariants({ variant: "brand", size: "lg" }),
                  "w-full shrink-0 justify-center sm:w-auto"
                )}
              >
                Jetzt spenden
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ───────────── Kontakt ───────────── */}
      {kontakt && (
        <Reveal>
          <section className="border-t border-border/70 bg-muted/40 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Kontakt"
                title="So erreichen Sie uns"
              />
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <ContactCard icon={<MapPin className="size-5" />} label="Adresse">
                  {kontakt.strasse}
                  <br />
                  {kontakt.ort}
                </ContactCard>
                {kontakt.telefon && (
                  <ContactCard icon={<Phone className="size-5" />} label="Telefon">
                    <a
                      href={`tel:${kontakt.telefon.replace(/\s+/g, "")}`}
                      className="transition-standard hover:text-primary"
                    >
                      {kontakt.telefon}
                    </a>
                  </ContactCard>
                )}
                <ContactCard icon={<Mail className="size-5" />} label="E-Mail">
                  <a
                    href={`mailto:${kontakt.email}`}
                    className="break-words transition-standard hover:text-primary"
                  >
                    {kontakt.email}
                  </a>
                </ContactCard>
              </div>
            </div>
          </section>
        </Reveal>
      )}
    </>
  );
}

function ContactCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card">
      <span className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon}
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 leading-relaxed text-foreground">{children}</div>
    </div>
  );
}
