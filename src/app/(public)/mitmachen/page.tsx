import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sprout, Building2, HandHeart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Mitmachen",
  description:
    "Landwirtschaftsbetriebe, Gemeinden, Städte, Flächeneigentümer und Spendende können sich am Schutz von Wildtieren beteiligen.",
  alternates: { canonical: "/mitmachen" },
};

const WAYS = [
  {
    icon: Sprout,
    title: "Landwirtschaftsbetriebe",
    text: "Sie möchten Rehkitze vor der Mahd schützen (WILDSEEK) oder Ihre Weiden wildtierschonend einzäunen? Für beide Projekte führen wir Wartelisten – nehmen Sie mit uns Kontakt auf.",
    cta: { href: "/kontakt", label: "Kontakt aufnehmen" },
  },
  {
    icon: Building2,
    title: "Gemeinden, Städte & Flächeneigentümer",
    text: "Sie haben eine geeignete Fläche für eine Biodiversitätsinsel oder möchten ein gemeinsames Projekt umsetzen? Wir freuen uns über Ihre Anfrage.",
    cta: { href: "/kontakt", label: "Projekt anfragen" },
  },
  {
    icon: HandHeart,
    title: "Spenderinnen & Spender",
    text: "Mit einer Spende unterstützen Sie unsere Projekte für Schweizer Wildtiere direkt – jeder Beitrag zählt.",
    cta: { href: "/unterstuetzen", label: "Unterstützen" },
  },
];

export default function MitmachenPage() {
  return (
    <>
      <PageHero
        eyebrow="Mitwirken"
        title="Mitmachen"
        lead="Ob Landwirtschaftsbetrieb, Gemeinde, Flächeneigentümerin oder Privatperson – es gibt verschiedene Möglichkeiten, den Schutz von Wildtieren aktiv zu unterstützen."
      />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {WAYS.map((way) => (
            <div
              key={way.title}
              className="flex flex-col rounded-2xl border border-border/80 bg-card p-7 shadow-card"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <way.icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-primary">
                {way.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {way.text}
              </p>
              <Link
                href={way.cta.href}
                className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
              >
                {way.cta.label}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/70 bg-muted/50 p-6 text-sm text-muted-foreground">
          Strukturierte Formulare – etwa für WILDSEEK-Einsatzmeldungen,
          Rückmeldungen zu Weidezäunen und Wartelisten – sind in Vorbereitung.
          Bis dahin erreichen Sie uns direkt über das{" "}
          <Link href="/kontakt" className="font-medium text-primary underline-offset-4 hover:underline">
            Kontaktformular
          </Link>
          .
        </div>

        <div className="mt-10">
          <Link
            href="/unterstuetzen"
            className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
          >
            Jetzt unterstützen
          </Link>
        </div>
      </section>
    </>
  );
}
