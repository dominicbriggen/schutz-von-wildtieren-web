import Link from "next/link";
import { Logo } from "@/components/logo";
import { getFooter, getKontakt } from "@/lib/content";

export async function SiteFooter() {
  const [kontakt, footer] = await Promise.all([getKontakt(), getFooter()]);
  const vereinsname = footer?.vereinsname ?? "Schutz von Wildtieren";

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-9" />
            <p className="text-lg font-semibold">{vereinsname}</p>
          </div>
          {kontakt && (
            <address className="mt-3 space-y-1 text-sm not-italic text-primary-foreground/80">
              <p>{kontakt.strasse}</p>
              <p>{kontakt.ort}</p>
              {kontakt.telefon && <p>Tel.: {kontakt.telefon}</p>}
              <p>
                <a
                  href={`mailto:${kontakt.email}`}
                  className="underline-offset-4 hover:underline"
                >
                  {kontakt.email}
                </a>
              </p>
            </address>
          )}
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            Wichtige Seiten
          </p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link href="/projekte" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                Projekte
              </Link>
            </li>
            <li>
              <Link href="/erfolge" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                Erfolge
              </Link>
            </li>
            <li>
              <Link href="/unterstuetzen" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                Spenden
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
            Rechtliches
          </p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link href="/impressum" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/agb" className="transition-standard hover:underline underline-offset-4 hover:text-primary-foreground">
                AGB
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-primary-foreground/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {vereinsname}. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
