import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Binoculars, Fence, Sprout, HandHeart } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Rückmeldungen & Projektteilnahme",
  description:
    "Rückmeldungen aus der Praxis: WILDSEEK-Einsätze melden, Erfahrungen mit Weidezäunen dokumentieren oder Interesse an einer Projektteilnahme anmelden.",
  alternates: { canonical: "/mitmachen" },
};

// Ruhige, natürliche Bildsprache statt technischer UI-Symbole:
//  Fernglas (Wildtierbeobachtung), Zaun (weich), junger Trieb/Weide
//  (Praxis statt Waage), Hand mit Herz (nahbares Mitmachen).
const ENTRIES = [
  {
    icon: Binoculars,
    title: "WILDSEEK-Einsatz melden",
    text: "Für Betriebe, die bereits ein WILDSEEK-System einsetzen.",
    href: "/mitmachen/wildseek",
  },
  {
    icon: Fence,
    title: "Wildtierschonender Weidezaun – Rückmeldung",
    text: "Für Betriebe, die an unserem Weidezaunprojekt teilnehmen.",
    href: "/mitmachen/weidezaun-projekt",
  },
  {
    icon: Sprout,
    title: "Bestehenden Weidezaun melden",
    text: "Für Betriebe, die nicht an unserem Projekt teilnehmen und Erfahrungen mit anderen Zaunsystemen melden möchten.",
    href: "/mitmachen/weidezaun-vergleich",
  },
  {
    icon: HandHeart,
    title: "An einem Projekt teilnehmen",
    text: "Für Betriebe, die sich für WILDSEEK oder wildtierschonende Weidezäune interessieren.",
    href: "/mitmachen/projektteilnahme",
  },
];

export default function MitmachenPage() {
  return (
    <>
      <PageHero
        eyebrow="Mitmachen"
        title="Rückmeldungen & Projektteilnahme"
        lead="Rückmeldungen aus der Praxis helfen uns, unsere Projekte zu dokumentieren, ihre Wirkung besser zu verstehen und sie gezielt weiterzuentwickeln."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <ul className="border-t border-border">
          {ENTRIES.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="group flex items-start gap-5 border-b border-border py-7 transition-standard hover:bg-secondary/25"
              >
                <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <entry.icon
                    className="size-[1.35rem]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-lg font-semibold text-primary">
                    {entry.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {entry.text}
                  </span>
                </span>
                <ArrowRight
                  className="mt-2 size-5 shrink-0 text-muted-foreground transition-standard group-hover:translate-x-1 group-hover:text-brand"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          Ihre Angaben werden ausschliesslich zur Dokumentation und
          Weiterentwicklung unserer Projekte verwendet. Wie wir mit Ihren Daten
          umgehen, beschreibt unsere{" "}
          <Link
            href="/datenschutz"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
      </section>
    </>
  );
}
