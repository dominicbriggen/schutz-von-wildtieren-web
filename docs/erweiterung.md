# Spätere Erweiterung

Das Projekt ist bewusst modular aufgebaut, damit einzelne Bereiche später
erweitert werden können, ohne die bestehende Struktur umzubauen.

## Neuen Dashboard-Bereich ergänzen

1. Neuen Ordner unter `src/app/admin/(dashboard)/` anlegen (z. B. `veranstaltungen/`).
2. `page.tsx` mit einer `AdminPageHeader`-Komponente und der gewünschten
   Liste/Formular erstellen (orientieren Sie sich an `erfolge/` oder
   `projekte/` als Vorlage).
3. Server Actions für Lesen/Schreiben in `src/lib/actions/` ergänzen.
4. Neue Datenbanktabelle über eine neue Datei in `supabase/migrations/`
   anlegen, inklusive passender Row-Level-Security-Regeln (siehe
   `0001_init.sql` als Vorlage).
5. Neuen Menüpunkt in `src/components/admin/admin-nav-links.ts` ergänzen.

## Weitere Administrator-Konten ergänzen

Aktuell ist das Rollenmodell bewusst einfach: ein `is_admin`-Feld pro
Benutzerkonto in der Tabelle `profiles`. Um eine weitere Person Zugriff zu
geben:

1. Die Person meldet sich einmal versuchsweise an der Anmeldeseite an (oder
   erhält eine Einladung über die Supabase-Auth-Funktion `inviteUserByEmail`).
2. In der Supabase-Datenbank wird für ihr Konto `profiles.is_admin` auf
   `true` gesetzt.

Für ein differenzierteres Rollenmodell (z. B. „kann nur Neuigkeiten
bearbeiten“) könnte das `profiles`-Schema um eine `role`-Spalte erweitert
und die bestehenden Row-Level-Security-Regeln entsprechend verfeinert
werden.

## Mehrsprachigkeit

Die Inhalte liegen aktuell als einfache Textfelder in den jeweiligen
Tabellen (`projects`, `news`, `content_blocks`, …). Für Mehrsprachigkeit
böte sich an, pro Sprache eigene Felder (z. B. `title_de`, `title_fr`) oder
eine separate Übersetzungstabelle zu ergänzen und im Frontend anhand der
gewählten Sprache die passenden Felder zu laden.

## Veranstaltungen

Eine Veranstaltungsverwaltung liesse sich analog zu `news` (Neuigkeiten)
umsetzen: eigene Tabelle mit Titel, Beschreibung, Datum, Ort, Status —
sowie eine öffentliche Übersichtsseite und ein Dashboard-Bereich nach dem
gleichen Muster wie oben beschrieben.

## Zusätzliche Seitentypen

Wiederkehrende, einmalige Inhaltsblöcke (wie Startseite oder Kontakt)
lassen sich einfach über einen neuen Eintrag in der Tabelle
`content_blocks` (neuer `key`) abbilden, ganz ohne neue Tabelle — siehe
`src/lib/content.ts` und `src/lib/actions/content-blocks.ts` als Vorlage.

## Erweitertes Medienarchiv

Die Tabelle `media` protokolliert bereits jedes hochgeladene Bild
(Speicherpfad, URL, Zeitpunkt). Eine eigene Übersichtsseite über alle
hochgeladenen Bilder (unabhängig von der Bildergalerie) liesse sich darauf
direkt aufbauen.
