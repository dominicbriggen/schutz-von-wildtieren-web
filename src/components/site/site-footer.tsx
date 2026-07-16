import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getFooter, getKontakt } from "@/lib/content";

export async function SiteFooter() {
  const [kontakt, footer] = await Promise.all([getKontakt(), getFooter()]);
  const vereinsname = footer?.vereinsname ?? "Schutz von Wildtieren";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        {/* Verein + Kontakt */}
        <div className="max-w-sm">
          <p className="text-lg font-bold tracking-tight">{vereinsname}</p>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
            Gemeinnütziger Verein für den Schutz von Wildtieren und ihren
            Lebensräumen in der Schweiz.
          </p>
          {kontakt && (
            <address className="mt-5 space-y-2.5 text-sm not-italic text-primary-foreground/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary-foreground/50" aria-hidden="true" />
                <span>
                  {kontakt.strasse}
                  <br />
                  {kontakt.ort}
                </span>
              </p>
              {kontakt.telefon && (
                <p className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-primary-foreground/50" aria-hidden="true" />
                  <a
                    href={`tel:${kontakt.telefon.replace(/\s+/g, "")}`}
                    className="underline-offset-4 transition-standard hover:text-primary-foreground hover:underline"
                  >
                    {kontakt.telefon}
                  </a>
                </p>
              )}
              <p className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary-foreground/50" aria-hidden="true" />
                <a
                  href={`mailto:${kontakt.email}`}
                  className="underline-offset-4 transition-standard hover:text-primary-foreground hover:underline"
                >
                  {kontakt.email}
                </a>
              </p>
            </address>
          )}
        </div>

        <FooterColumn
          title="Verein"
          links={[
            { href: "/projekte", label: "Projekte" },
            { href: "/erfolge", label: "Erfolge" },
            { href: "/aktuelles", label: "Aktuelles" },
            { href: "/verein", label: "Über uns" },
            { href: "/unterstuetzen", label: "Spenden" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
        />

        <FooterColumn
          title="Rechtliches"
          links={[
            { href: "/impressum", label: "Impressum" },
            { href: "/datenschutz", label: "Datenschutz" },
            { href: "/agb", label: "AGB" },
          ]}
        />
      </div>

      <div className="border-t border-primary-foreground/12">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-primary-foreground/55 sm:px-6 lg:px-8">
          © {year} {vereinsname}. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/50">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="underline-offset-4 transition-standard hover:text-primary-foreground hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
