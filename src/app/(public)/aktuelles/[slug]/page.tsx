import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { ProseText } from "@/components/site/prose-text";
import { getNewsBySlug } from "@/lib/content";
import { createStaticClient } from "@/lib/supabase/static";

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("news")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  return { title: item.title, description: item.summary ?? undefined };
}

export default async function AktuellesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <>
      {item.status !== "published" && (
        <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
          Vorschau — dieser Beitrag ist noch nicht veröffentlicht und nur für Sie als Administrator sichtbar.
        </div>
      )}
      <PageHero eyebrow="Aktuelles" title={item.title} lead={item.date_label ?? undefined} />
      {item.cover_image_url && (
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
          <Image
            src={item.cover_image_url}
            alt={item.title}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        {item.body && <ProseText text={item.body} />}
      </article>
    </>
  );
}
