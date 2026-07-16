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
      <PageHero title="Aktuelles" lead="Neuigkeiten und Einsätze aus unserer Vereinsarbeit." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {news.length === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="space-y-8">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/aktuelles/${item.slug}`}
                className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md sm:flex-row"
              >
                {item.cover_image_url && (
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-56">
                    <Image
                      src={item.cover_image_url}
                      alt={item.title}
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  {item.date_label && (
                    <span className="text-sm font-medium text-accent">
                      {item.date_label}
                    </span>
                  )}
                  <h2 className="mt-1 font-heading text-xl font-semibold text-foreground group-hover:text-primary">
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
