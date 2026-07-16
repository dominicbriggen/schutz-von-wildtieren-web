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
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
                className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm transition-standard hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:p-6"
              >
                {item.cover_image_url && (
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56">
                    <Image
                      src={item.cover_image_url}
                      alt={item.title}
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div>
                  {item.date_label && (
                    <span className="text-sm font-medium text-accent">
                      {item.date_label}
                    </span>
                  )}
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
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
