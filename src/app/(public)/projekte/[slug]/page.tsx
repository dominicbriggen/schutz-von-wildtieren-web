import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { ProseText } from "@/components/site/prose-text";
import { getProjectBySlug, getSuccessEntries } from "@/lib/content";
import { createStaticClient } from "@/lib/supabase/static";

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
  };
}

export default async function ProjektDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, successEntries] = await Promise.all([
    getProjectBySlug(slug),
    getSuccessEntries(),
  ]);

  if (!project) notFound();

  const results = successEntries.filter((e) => e.project_slug === project.slug);
  const galleryImages = project.images.filter(
    (url) => url !== project.cover_image_url
  );

  return (
    <>
      {project.status !== "published" && (
        <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
          Vorschau — dieser Beitrag ist noch nicht veröffentlicht und nur für Sie als Administrator sichtbar.
        </div>
      )}
      <PageHero eyebrow="Projekt" title={project.title} lead={project.summary ?? undefined} />

      {project.cover_image_url && (
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_320px] lg:px-8">
        <article>
          {project.body && <ProseText text={project.body} />}

          {galleryImages.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galleryImages.map((url, i) => (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={url}
                    alt={`${project.title} – Bild ${i + 2}`}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {results.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold text-primary">
                Ergebnisse
              </h2>
              <ul className="mt-4 space-y-3">
                {results.map((entry) => (
                  <li key={entry.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    {entry.period_label && (
                      <p className="text-xs text-muted-foreground">{entry.period_label}</p>
                    )}
                    <p className="font-medium text-foreground">{entry.value_label}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-brand/25 bg-brand/[0.06] p-6">
            <h2 className="text-lg font-semibold text-primary">
              Dieses Projekt unterstützen
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mit Ihrer Spende helfen Sie mit, Projekte wie dieses weiterzuführen und auszubauen.
            </p>
            <Link href="/unterstuetzen" className={cn(buttonVariants({ variant: "brand" }), "mt-4 w-full justify-center")}>
              Jetzt spenden
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
