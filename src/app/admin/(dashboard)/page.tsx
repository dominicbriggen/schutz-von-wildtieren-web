import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/components/admin/admin-nav-links";

const DESCRIPTIONS: Record<string, string> = {
  "/admin/startseite": "Hauptaussage, Vereinstext und Startbild bearbeiten.",
  "/admin/verein": "Vereinspräsident, Team und Ziele bearbeiten.",
  "/admin/projekte": "Projekte erstellen, bearbeiten, veröffentlichen oder ausblenden.",
  "/admin/neuigkeiten": "Neuigkeiten erstellen, bearbeiten, veröffentlichen oder ausblenden.",
  "/admin/erfolge": "Erfolge und Ergebnisse je Projekt pflegen.",
  "/admin/bilder": "Bilder hochladen und der Bildergalerie zuordnen.",
  "/admin/spenden": "Spendentext und Beträge bearbeiten.",
  "/admin/kontakt": "Kontaktangaben bearbeiten und Nachrichten lesen.",
};

export default function AdminHomePage() {
  const cards = ADMIN_NAV_LINKS.filter((l) => l.href !== "/admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Willkommen im Verwaltungsbereich
      </h1>
      <p className="mt-2 text-muted-foreground">
        Wählen Sie einen Bereich aus, um Inhalte der Website zu bearbeiten.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-6 shadow-sm transition-standard hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-lg font-semibold text-foreground">
              {card.label}
            </span>
            <span className="text-sm text-muted-foreground">
              {DESCRIPTIONS[card.href]}
            </span>
            <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-primary">
              Öffnen
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
