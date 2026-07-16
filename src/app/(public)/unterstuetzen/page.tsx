import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { ProseText } from "@/components/site/prose-text";
import { getKontakt, getSpenden } from "@/lib/content";

export const metadata: Metadata = {
  title: "Unterstützen",
  description:
    "Unterstützen Sie den Schutz von Wildtieren mit einer Spende – gemeinnützig, steuerbefreit und transparent.",
};

export default async function UnterstuetzenPage() {
  const [spenden, kontakt] = await Promise.all([getSpenden(), getKontakt()]);

  if (!spenden) {
    return (
      <>
        <PageHero title="Unterstützen" />
        <p className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">
          [Information muss ergänzt oder bestätigt werden]
        </p>
      </>
    );
  }

  return (
    <>
      <PageHero title="Unterstützen" lead={spenden.title} />

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <ProseText text={spenden.text} />

          <div className="mt-6 flex flex-wrap gap-2">
            {spenden.amounts.map((amount) => (
              <span
                key={amount}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground"
              >
                {amount} CHF
              </span>
            ))}
            <span className="rounded-full border border-dashed border-border px-4 py-1.5 text-sm text-muted-foreground">
              Frei wählbar
            </span>
          </div>

          <div
            role="status"
            className="mt-8 rounded-lg border border-accent/40 bg-accent/10 p-5"
          >
            <p className="text-sm font-medium text-foreground">
              Online-Spenden aktuell in Vorbereitung
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {spenden.placeholder_note}
            </p>
            {kontakt && (
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <a
                  href={`mailto:${kontakt.email}`}
                  className="flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {kontakt.email}
                </a>
                {kontakt.telefon && (
                  <a
                    href={`tel:${kontakt.telefon.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {kontakt.telefon}
                  </a>
                )}
              </div>
            )}
            <a
              href={`mailto:${kontakt?.email ?? ""}`}
              className={cn(buttonVariants(), "mt-4")}
            >
              Für eine Spende kontaktieren
            </a>
          </div>
        </div>

        {spenden.hero_image_url && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted lg:aspect-auto">
            <Image
              src={spenden.hero_image_url}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </section>
    </>
  );
}
