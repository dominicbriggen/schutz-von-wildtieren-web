import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { getKontakt } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie den Verein Schutz von Wildtieren.",
};

export default async function KontaktPage() {
  const kontakt = await getKontakt();

  return (
    <>
      <PageHero eyebrow="Kontakt" title="Kontakt" lead="Wir freuen uns auf Ihre Nachricht." />
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:px-8">
        {kontakt && (
          <div className="h-fit rounded-2xl border border-border/80 bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground">{kontakt.name}</p>
                <p className="text-muted-foreground">
                  {kontakt.strasse}
                  <br />
                  {kontakt.ort}
                </p>
              </div>
            </div>
            <div className="my-5 h-px bg-border" />
            {kontakt.telefon && (
              <div className="flex items-center gap-3 py-1.5">
                <Phone className="size-5 shrink-0 text-brand" aria-hidden="true" />
                <a
                  href={`tel:${kontakt.telefon.replace(/\s+/g, "")}`}
                  className="text-foreground transition-standard hover:text-primary"
                >
                  {kontakt.telefon}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 py-1.5">
              <Mail className="size-5 shrink-0 text-brand" aria-hidden="true" />
              <a
                href={`mailto:${kontakt.email}`}
                className="break-words text-foreground transition-standard hover:text-primary"
              >
                {kontakt.email}
              </a>
            </div>
            {kontakt.instagram_url ? (
              <div className="flex items-center gap-3 py-1.5">
                <ExternalLink className="size-5 shrink-0 text-brand" aria-hidden="true" />
                <a
                  href={kontakt.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-standard hover:text-primary"
                >
                  Instagram
                </a>
              </div>
            ) : (
              kontakt.instagram_note && (
                <p className="mt-3 text-sm italic text-muted-foreground">
                  {kontakt.instagram_note}
                </p>
              )
            )}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Nachricht schreiben
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
