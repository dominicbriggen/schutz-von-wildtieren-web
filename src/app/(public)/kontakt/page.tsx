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
      <PageHero title="Kontakt" lead="Wir freuen uns auf Ihre Nachricht." />
      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        {kontakt && (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">{kontakt.name}</p>
                <p className="text-muted-foreground">
                  {kontakt.strasse}
                  <br />
                  {kontakt.ort}
                </p>
              </div>
            </div>
            {kontakt.telefon && (
              <div className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={`tel:${kontakt.telefon.replace(/\s+/g, "")}`}
                  className="text-foreground hover:text-primary"
                >
                  {kontakt.telefon}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <a
                href={`mailto:${kontakt.email}`}
                className="text-foreground hover:text-primary"
              >
                {kontakt.email}
              </a>
            </div>
            {kontakt.instagram_url ? (
              <div className="flex items-center gap-3">
                <ExternalLink className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={kontakt.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary"
                >
                  Instagram
                </a>
              </div>
            ) : (
              kontakt.instagram_note && (
                <p className="text-sm italic text-muted-foreground">
                  {kontakt.instagram_note}
                </p>
              )
            )}
          </div>
        )}

        <div>
          <h2 className="font-heading text-xl font-semibold text-primary">
            Nachricht schreiben
          </h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
