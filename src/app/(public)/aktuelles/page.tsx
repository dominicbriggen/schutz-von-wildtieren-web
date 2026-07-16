import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Aktuelles",
  description: "Neuigkeiten, Einsätze und Vereinsmitteilungen von Schutz von Wildtieren.",
};

export default async function AktuellesPage() {
  const news = await getNews();

  return (
    <>
      <PageHero eyebrow="Neuigkeiten" title="Aktuelles" lead="Neuigkeiten und Einsätze aus unserer Vereinsarbeit." />
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        {news.length === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/aktuelles/${item.slug}`}
                className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-standard hover:-translate-y-1 hover:shadow-card-hover sm:flex-row sm:items-stretch sm:p-4"
              >
                {item.cover_image_url && (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-auto sm:w-60">
                    <Image
                      src={item.cover_image_url}
                      alt={item.title}
                      fill
                      sizes="(min-width: 640px) 240px, 100vw"
                      className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center px-1 pb-2 sm:px-3 sm:py-4">
                  {item.date_label && (
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      {item.date_label}
                    </span>
                  )}
                  <h2 className="mt-1.5 text-xl font-semibold leading-snug text-foreground">
                    {item.title}
                  </h2>
                  {item.summary && (
                    <p className="mt-2 text-muted-foreground">{item.summary}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
