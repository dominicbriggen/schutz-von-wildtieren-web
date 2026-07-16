# Schutz von Wildtieren — Website & Verwaltungsbereich

Neue Website des Schweizer Vereins **Schutz von Wildtieren**. Ersetzt die
bisherige Wix-Website durch eine selbst betriebene, moderne und technisch
saubere Lösung mit einem einfachen Verwaltungsbereich, über den der Verein
die Inhalte selbst pflegen kann.

Alle Inhalte (Texte, Projekte, Bilder, Erfolge) wurden von der bisherigen
Website übernommen. Wo Informationen fehlten, ist dies im Text mit
`[Information muss ergänzt oder bestätigt werden]` gekennzeichnet.

## Technologien

| Bereich | Technologie |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router, TypeScript, Turbopack) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 + [shadcn/ui](https://ui.shadcn.com) (Base UI) |
| Datenbank, Auth, Bildspeicher | [Supabase](https://supabase.com) (Postgres, Row Level Security, Storage) |
| Hosting | [Vercel](https://vercel.com) |
| Formulare/Validierung | react-hook-form, Zod |

Alle verwendeten Dienste haben einen kostenlosen Tarif, der für dieses
Projekt ausreicht. Details siehe [docs/technik.md](docs/technik.md#kosten).

## Projektstruktur

```
src/
  app/
    (public)/        Öffentliche Website (Startseite, Projekte, Kontakt, ...)
    admin/
      login/          Anmeldeseite (öffentlich)
      (dashboard)/     Geschützter Verwaltungsbereich
  components/
    site/             Komponenten der öffentlichen Website
    admin/             Komponenten des Verwaltungsbereichs
    ui/                shadcn/ui-Basiskomponenten
  lib/
    actions/           Server Actions (serverseitige Schreibzugriffe)
    supabase/           Supabase-Client-Konfiguration
    content.ts          Datenzugriff für die öffentliche Website
    types.ts             Gemeinsame TypeScript-Typen
supabase/
  migrations/            Datenbank-Schema (SQL)
  seed.sql                Ursprüngliche Inhalte von der alten Website
docs/                     Ausführliche Dokumentation (siehe unten)
```

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
cp .env.example .env.local   # dann die echten Supabase-Werte eintragen
npm run dev
```

Die Website ist danach unter `http://localhost:3000` erreichbar, der
Verwaltungsbereich unter `http://localhost:3000/admin`.

## Weiterführende Dokumentation

- [docs/dashboard.md](docs/dashboard.md) — Bedienungsanleitung für den Verwaltungsbereich
- [docs/technik.md](docs/technik.md) — Technische Architektur, Datenspeicherung, Kosten
- [docs/erweiterung.md](docs/erweiterung.md) — Wie das Projekt später erweitert werden kann

## Qualitätssicherung

```bash
npm run lint        # ESLint
npx tsc --noEmit     # TypeScript-Typprüfung
npm run build        # Produktions-Build
```

## Sicherheit

- Der Verwaltungsbereich ist über Supabase Auth geschützt; jede Route unter
  `/admin` prüft serverseitig (Proxy/Middleware **und** Datenbankregeln),
  ob eine berechtigte, angemeldete Person zugreift.
- Row Level Security ist für jede Tabelle aktiv: Öffentliche Besucher sehen
  ausschliesslich veröffentlichte Inhalte, Schreibzugriffe sind ausschliesslich
  dem angemeldeten Administrator-Konto vorbehalten.
- Der `service_role`-Schlüssel von Supabase wird ausschliesslich für
  einmalige, lokale Verwaltungsskripte (`scripts/`) verwendet und ist
  **nicht** Teil der ausgelieferten Website oder der Vercel-Umgebungsvariablen.
- Es werden keine Secrets im Repository gespeichert (`.env.local` ist in
  `.gitignore`, `.env.example` enthält keine echten Werte).
