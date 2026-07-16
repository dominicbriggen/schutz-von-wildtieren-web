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
      <PageHero title={project.title} lead={project.summary ?? undefined} />

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
              {galleryImages.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={url}
                    alt={project.title}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </article>

        <aside className="space-y-6">
          {results.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">
              Dieses Projekt unterstützen
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mit Ihrer Spende helfen Sie mit, Projekte wie dieses weiterzuführen und auszubauen.
            </p>
            <Link href="/unterstuetzen" className={cn(buttonVariants(), "mt-4 w-full shadow-sm")}>
              Jetzt spenden
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
