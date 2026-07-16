import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { getGalleryImages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bilder",
  description: "Aktuelle Projekt- und Tierbilder von Schutz von Wildtieren.",
};

export default async function BilderPage() {
  const images = await getGalleryImages();

  const byYear = new Map<string, typeof images>();
  for (const image of images) {
    const key = image.year ?? "Weitere Bilder";
    if (!byYear.has(key)) byYear.set(key, []);
    byYear.get(key)!.push(image);
  }

  return (
    <>
      <PageHero
        eyebrow="Impressionen"
        title="Bilder"
        lead="Aktuelles & Projektaufnahmen aus unserer Vereinsarbeit."
      />
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        {byYear.size === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="space-y-14">
            {Array.from(byYear.entries()).map(([year, yearImages]) => (
              <div key={year}>
                <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                  {year}
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {yearImages.map((image) => (
                    <figure
                      key={image.id}
                      className="group overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-card transition-standard hover:shadow-card-hover"
                    >
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt_text ?? image.category ?? "Bild"}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                        />
                      </div>
                      {image.category && (
                        <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">
                          {image.category}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
