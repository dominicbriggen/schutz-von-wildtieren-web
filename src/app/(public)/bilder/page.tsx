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
        title="Bilder"
        lead="Aktuelles & Projektaufnahmen aus unserer Vereinsarbeit."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {byYear.size === 0 ? (
          <p className="text-muted-foreground">
            [Information muss ergänzt oder bestätigt werden]
          </p>
        ) : (
          <div className="space-y-12">
            {Array.from(byYear.entries()).map(([year, yearImages]) => (
              <div key={year}>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {year}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {yearImages.map((image) => (
                    <figure
                      key={image.id}
                      className="overflow-hidden rounded-md bg-muted"
                    >
                      <div className="relative aspect-square w-full">
                        <Image
                          src={image.url}
                          alt={image.alt_text ?? image.category ?? "Bild"}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      {image.category && (
                        <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">
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
