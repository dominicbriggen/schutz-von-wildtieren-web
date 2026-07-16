import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, Mail, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/site/project-card";
import {
  getHomeHero,
  getKontakt,
  getNews,
  getProjects,
  getSuccessEntries,
} from "@/lib/content";

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
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-primary text-primary-foreground">
        {hero?.hero_image_url && (
          <Image
            src={hero.hero_image_url}
            alt=""
            fill
            priority
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            {hero?.headline ?? "Gemeinsam für die Natur und unsere Wildtiere."}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/unterstuetzen" className={cn(buttonVariants({ size: "lg" }))}>
              Spenden
            </Link>
            <Link
              href="/projekte"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              )}
            >
              Unsere Projekte
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
          {hero?.intro_title ?? "Unser Verein"}
        </h2>
        <div className="mt-4 space-y-4 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {(hero?.intro_text ?? "").split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {hero?.quote && (
          <p className="mt-8 font-heading text-lg italic text-primary/80">
            «{hero.quote}»
          </p>
        )}
      </section>

      {/* Projekte */}
      <section className="bg-muted/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
              Unsere Projekte
            </h2>
            <Link
              href="/projekte"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Alle Projekte ansehen
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Aktuelles */}
      {latestNews && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
            Aktuelles
          </h2>
          <div className="mt-8 grid gap-8 rounded-lg border border-border bg-card p-6 sm:grid-cols-[1fr_1.2fr] sm:p-8">
            {latestNews.cover_image_url && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted sm:order-2">
                <Image
                  src={latestNews.cover_image_url}
                  alt={latestNews.title}
                  fill
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-3 sm:order-1">
              {latestNews.date_label && (
                <span className="text-sm font-medium text-accent">
                  {latestNews.date_label}
                </span>
              )}
              <h3 className="font-heading text-xl font-semibold">
                {latestNews.title}
              </h3>
              {latestNews.summary && (
                <p className="text-muted-foreground">{latestNews.summary}</p>
              )}
              <Link
                href={`/aktuelles/${latestNews.slug}`}
                className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                Weiterlesen
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Erfolge */}
      {highlights.length > 0 && (
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Konkrete Erfolge
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {highlights.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-6"
                >
                  <p className="text-sm text-primary-foreground/70">
                    {entry.title}
                    {entry.period_label ? ` · ${entry.period_label}` : ""}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold">
                    {entry.value_label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/erfolge"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4"
            >
              Alle Erfolge ansehen
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* So können Sie helfen */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-lg border border-border bg-card p-8 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-10">
          <HandHeart className="size-12 text-accent" aria-hidden="true" />
          <div>
            <h2 className="font-heading text-2xl font-semibold text-primary">
              So können Sie helfen
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Mit einer Spende unterstützen Sie unsere Projekte für Schweizer
              Wildtiere und ihre Lebensräume – jeder Beitrag zählt.
            </p>
          </div>
          <Link
            href="/unterstuetzen"
            className={cn(buttonVariants({ size: "lg" }), "sm:justify-self-end")}
          >
            Jetzt spenden
          </Link>
        </div>
      </section>

      {/* Kontakt */}
      {kontakt && (
        <section className="bg-muted/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
              Kontakt
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-muted-foreground">
                  {kontakt.strasse}
                  <br />
                  {kontakt.ort}
                </p>
              </div>
              {kontakt.telefon && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <a
                    href={`tel:${kontakt.telefon.replace(/\s+/g, "")}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {kontakt.telefon}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={`mailto:${kontakt.email}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {kontakt.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
