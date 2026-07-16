# Technische Dokumentation

## Bildnachweise (externe Bilder)

Alle Projekt-, Team- und Galeriebilder stammen von der bisherigen Vereinswebsite.
Einzig die drei Hintergrundbilder der Startseiten-Diashow sind lizenzierte
externe Aufnahmen von Schweizer Wildtieren, da für diesen Zweck keine
eigenen hochauflösenden Aufnahmen vorlagen:

| Bild | Fotograf/in | Quelle | Lizenz |
|---|---|---|---|
| Reh-Kitz | Dave Dodson | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Roe_Deer_Fawn_(38558766).jpeg) | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/deed.de) |
| Igel | Rhamely | [Unsplash](https://unsplash.com/photos/a-close-up-of-a-hedgehog-in-the-grass-4ubVpOKj8ko) | [Unsplash-Lizenz](https://unsplash.com/license) (frei nutzbar, keine Namensnennung erforderlich) |
| Wildbiene | Rapha Wilde | [Unsplash](https://unsplash.com/photos/a-bee-on-a-flower-aqoX83qg6E8) | [Unsplash-Lizenz](https://unsplash.com/license) (frei nutzbar, keine Namensnennung erforderlich) |

Die Namensnennung wird trotzdem als gute Praxis eingehalten. Änderbar im
Verwaltungsbereich unter **Startseite → Startbilder**.

## Architektur

```
┌─────────────────────────┐
│  Vercel (Next.js)        │  Öffentliche Website + Verwaltungsbereich
│  Server Components,      │  laufen im selben Next.js-Projekt, streng
│  Server Actions           │  getrennt über Routing und Berechtigungen.
└───────────┬──────────────┘
            │ HTTPS (anon key im Browser, nie service_role)
            ▼
┌─────────────────────────┐
│  Supabase                │
│  - Postgres-Datenbank    │  Row Level Security auf jeder Tabelle
│  - Auth (E-Mail/Passwort)│  Ein Administrator-Konto
│  - Storage (Bucket        │  Öffentlich lesbar, nur Admin darf schreiben
│    "media")               │
└─────────────────────────┘
```

## Wo werden Daten gespeichert?

Alle Inhalte (Texte, Projekte, Neuigkeiten, Erfolge, Bildergalerie,
Kontaktangaben, Kontaktformular-Nachrichten) liegen in einer
Postgres-Datenbank bei Supabase. Das Datenbankschema befindet sich in
[`supabase/migrations`](../supabase/migrations); die ursprünglich von der
alten Website übernommenen Inhalte in [`supabase/seed.sql`](../supabase/seed.sql).

## Wo werden Bilder gespeichert?

Bilder liegen im öffentlichen Supabase-Storage-Bucket `media`. Hochgeladene
Bilder werden vor dem Speichern automatisch auf eine sinnvolle Grösse
begrenzt; die Auslieferung an Besuchende erfolgt über die
Bildoptimierung von Next.js (`next/image`), die je nach Gerät passende
Grössen und moderne Bildformate ausliefert.

## Wie funktioniert die Anmeldung?

Supabase Auth (E-Mail/Passwort) übernimmt die eigentliche Authentifizierung
— es wird keine eigene Passwortverschlüsselung entwickelt. Ob ein
angemeldetes Konto Zugriff auf `/admin` erhält, wird zusätzlich über ein
Feld `is_admin` in der Tabelle `profiles` gesteuert. Zwei unabhängige
Schutzebenen sichern den Verwaltungsbereich ab:

1. **Proxy/Middleware** (`src/proxy.ts`) — prüft bei jedem Aufruf von
   `/admin/*`, ob eine angemeldete, berechtigte Person zugreift, und leitet
   sonst zur Anmeldeseite um.
2. **Row Level Security** in der Datenbank — selbst wenn die erste Ebene
   umgangen würde, verweigert die Datenbank selbst jeden Schreibzugriff für
   nicht-berechtigte Konten.

## Wie sind Environment Variables eingerichtet?

Siehe [`.env.example`](../.env.example) für die benötigten Variablen.
Lokal werden sie in `.env.local` (nicht im Git-Repository) gepflegt, bei
Vercel als Projekt-Environment-Variablen. Der geheime `service_role`-Schlüssel
wird **nicht** bei Vercel hinterlegt — er wird ausschliesslich lokal für
einmalige Verwaltungsskripte in `scripts/` benötigt (z. B. zum Einrichten
des ersten Administrator-Kontos).

## Backups

Supabase erstellt auf dem kostenlosen Tarif automatische tägliche Backups
mit einer Aufbewahrung von einigen Tagen (siehe aktuelle Angaben im
Supabase-Dashboard des Projekts unter „Database → Backups“). Für zusätzliche
Sicherheit kann jederzeit ein manueller Export über
`supabase db dump` erstellt werden.

## Verwendete externe Dienste

| Dienst | Zweck | Kostenloser Tarif ausreichend? |
|---|---|---|
| Vercel | Hosting der Website | Ja, für dieses Projektvolumen |
| Supabase | Datenbank, Auth, Bildspeicher | Ja (siehe Grenzen unten) |
| Next.js Google Fonts (self-hosted) | Schriftarten, lokal ausgeliefert | Kostenlos, keine externen Anfragen zur Laufzeit |

### Kosten

Beide Dienste (Vercel, Supabase) werden im kostenlosen Tarif betrieben.
Mögliche künftige Kosten entstehen nur, wenn:

- die Website deutlich mehr Besucherverkehr oder Speicherbedarf erhält, als
  der kostenlose Tarif vorsieht (Vercel: Bandbreite/Function-Aufrufe;
  Supabase: Datenbankgrösse, Speicherplatz, aktive Nutzung), oder
- bewusst ein bezahlter Tarif für zusätzliche Funktionen (z. B. eigene
  Domain-E-Mails, höhere Limits) aktiviert wird.

Es ist **keine Kreditkarte hinterlegt** und es werden **keine automatischen
Zahlungen** ausgelöst. Ein Wechsel auf einen bezahlten Tarif erfolgt nur
durch bewusste, manuelle Aktion im jeweiligen Dashboard.

## Qualitätssicherung

- `npx tsc --noEmit` — TypeScript-Typprüfung (kein `any` ohne Grund)
- `npm run lint` — ESLint
- `npm run build` — Produktions-Build (muss fehlerfrei durchlaufen)
