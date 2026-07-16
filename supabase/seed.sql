-- Seed data migrated from the previous Wix site (schutz-von-wildtieren.ch).
-- All texts are the original content, lightly copy-edited for clarity and
-- Swiss spelling. No projects, figures, or claims were invented. Gaps in
-- the source material are marked with [Information muss ergänzt oder
-- bestätigt werden].

set search_path = public;

-- Storage base for the images re-hosted from the old site.
-- https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/<file>

-- ---------------------------------------------------------------------
-- content_blocks
-- ---------------------------------------------------------------------

-- Hero images are licensed stock/CC photography (Rehkitz, Igel, Wildbiene),
-- not original association photos — see docs/technik.md for full credits.
insert into content_blocks (key, data) values (
  'home_hero',
  $${
    "headline": "Gemeinsam für die Natur und unsere Wildtiere.",
    "subline": "Wir schützen Wildtiere und ihre Lebensräume in der Schweiz – mit konkreten, wirkungsvollen Projekten.",
    "quote": "Wenn man seine Zeit mit Tieren verbringt, befindet man sich immer in guter Gesellschaft.",
    "intro_title": "Unser Verein",
    "intro_text": "Der Verein «Schutz von Wildtieren» ist eine gemeinnützige Organisation, die sich für die Umwelt und den Tierschutz einsetzt.\n\nWir suchen innovative Lösungen und setzen diese in der Praxis um. Zudem verfolgen wir Pilotprojekte, die der Umwelt und dem Tierschutz dienen.",
    "primary_cta_label": "Projekte entdecken",
    "primary_cta_href": "/projekte",
    "secondary_cta_label": "Jetzt unterstützen",
    "secondary_cta_href": "/unterstuetzen",
    "hero_images": [
      {
        "url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/hero/hero-rehkitz.jpg",
        "alt": "Reh-Kitz steht im hohen Gras am Waldrand",
        "credit": "Foto: Dave Dodson / Wikimedia Commons, CC BY 3.0"
      },
      {
        "url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/hero/hero-igel.jpg",
        "alt": "Igel zusammengerollt im Gras, Ansicht von oben",
        "credit": "Foto: Rhamely / Unsplash"
      },
      {
        "url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/hero/hero-wildbiene.jpg",
        "alt": "Wildbiene im Anflug auf eine Mohnblüte",
        "credit": "Foto: Rapha Wilde / Unsplash"
      }
    ]
  }$$::jsonb
) on conflict (key) do update set data = excluded.data;

insert into content_blocks (key, data) values (
  'verein',
  $${
    "founder_name": "Rudolf Locher",
    "founder_role": "Vereinspräsident und Gründer",
    "founder_bio": "Ich, Rudolf Locher, lebe seit vielen Jahrzehnten mit Tieren. Schon als Kind entwickelte ich eine tiefe Verbundenheit zu allen Lebewesen. Ob Hund, Katze, Meerschweinchen, Hase, Fisch oder Pferd: Für mich waren Tiere immer mehr als Haustiere. Sie waren Mitbewohner, Gefährten und ein beständiger Teil meines Alltags.\n\nDiese jahrzehntelange Nähe zu Tieren hat meinen Blick geprägt. Ich habe gelernt, ihre Bedürfnisse zu erkennen und ihren Platz auf dieser Erde ernst zu nehmen. Tiere sind fühlende Wesen mit Rechten und einer Würde, die oft übersehen wird.\n\nParallel dazu zog mich die Technik schon früh in ihren Bann. In den 1970er-Jahren gründete ich mein eigenes Unternehmen im Bereich Elektronik und Telematik, das ich bis 2017 erfolgreich führte und danach an meinen Sohn übergab. Die lange unternehmerische Arbeit, das Entwickeln und Tüfteln haben mich mein Leben lang begleitet.\n\nNach der Übergabe des Unternehmens konnte ich mich erstmals zurücklehnen und die neu gewonnene Freiheit geniessen. Ganz ohne Projekte war mein Alltag aber nie. Ich tüftelte weiter an technischen Ideen, probierte Neues aus und liess die vielen Jahre Berufserfahrung nachwirken. Doch mit der Zeit merkte ich, dass mir ein langfristiges, sinnstiftendes Engagement fehlte.\n\nSo entstand 2023 der Verein «Schutz von Wildtieren». Was als ruhige Phase nach meinem Berufsleben begann, wurde zu einem neuen Schwerpunkt im späteren Lebensabschnitt. Der Tierschutz ist für mich kein berufliches Vorhaben, sondern ein persönliches Projekt, das Raum für Verantwortung, Erfahrung und Herzblut bietet.",
    "founder_photo_url": null,
    "founder_photo_note": "[Information muss ergänzt oder bestätigt werden – auf der bisherigen Website war kein Foto von Rudolf Locher hinterlegt]",
    "helpers": [
      {
        "name": "Dominic Briggen",
        "role": "Helfende Kraft",
        "bio": "Ich bin Dominic Briggen und unterstütze meinen Grossonkel als verlässliche helfende Hand in seinen Projekten. Überall dort, wo Organisation, praktische Mithilfe oder einfach jemand gebraucht wird, der mit anpackt, bin ich dabei.\n\nIch bin mit Tieren aufgewachsen und lebe heute mit zwei Katzen, zwei Hunden und vier Hasen zusammen. Dieses enge Zusammenleben prägt mich bis heute und weckt jeden Tag aufs Neue die Freude am Tierschutz. Genau deshalb engagiere ich mich an seiner Seite und bringe meine Zeit und Energie in unsere gemeinsamen Vorhaben ein.",
        "photo_url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/team-dominic-briggen.jpg"
      },
      {
        "name": "Livia Schilling",
        "role": "Mithilfe bei Projekten",
        "bio": "Ich bin Livia Schilling aus Gockhausen und packe bei unseren Projekten zuverlässig mit an. Neben meinem Einsatz für den Verein Schutz von Wildtieren arbeite ich als Primarlehrerin und engagiere mich zusätzlich ehrenamtlich für den Hundegarten Serres in Griechenland. Ich unterstütze dort, wo ich gebraucht werde.",
        "photo_url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/team-livia-schilling.jpg"
      }
    ],
    "goals_title": "Unsere Ziele",
    "goals_text": "Unser Ziel ist es, den Tierschutz und den Umweltschutz nachhaltig und wirkungsvoll zu fördern. Um diese Mission erfolgreich umzusetzen, setzen wir auf moderne Technologien und entwickeln unter anderem eigene, innovative Lösungsansätze, die wir aktiv in die Praxis überführen. Durch die Zusammenarbeit mit anderen Vereinen, Gemeinden, Kantonen sowie ehrenamtlichen Organisationen schaffen wir starke Partnerschaften, um gemeinsam konkrete Fortschritte für Tiere und Umwelt zu erzielen."
  }$$::jsonb
) on conflict (key) do update set data = excluded.data;

insert into content_blocks (key, data) values (
  'kontakt',
  $${
    "name": "Schutz von Wildtieren",
    "strasse": "Eichackerstrasse 22",
    "ort": "8600 Dübendorf",
    "telefon": "+41 78 648 50 67",
    "email": "info@schutz-von-wildtieren.ch",
    "instagram_url": null,
    "instagram_note": "[Information muss ergänzt oder bestätigt werden – der bisherige Instagram-Link auf der alten Website war fehlerhaft]"
  }$$::jsonb
) on conflict (key) do update set data = excluded.data;

insert into content_blocks (key, data) values (
  'spenden',
  $${
    "title": "Für Wildtiere, Artenvielfalt und eine gesunde Natur.",
    "text": "Mit Ihrer Spende unterstützen Sie den Schutz von Wildtieren, die Förderung der Artenvielfalt sowie den Erhalt unserer Umwelt. Jeder Beitrag hilft uns, wertvolle Lebensräume zu bewahren und konkrete Tierschutzprojekte umzusetzen.\n\nUnser Verein ist gemeinnützig anerkannt und somit steuerbefreit. Ihre Spende können Sie in der Schweiz von den Steuern abziehen. Gerne stellen wir Ihnen eine Spendenbestätigung aus.\n\nDanke, dass Sie mithelfen, Natur und Tiere zu schützen!",
    "amounts": [20, 50, 100, 200],
    "online_payment_ready": false,
    "placeholder_note": "Online-Spenden über die neue Website sind in Vorbereitung. [Information muss ergänzt oder bestätigt werden] Bis zur Freischaltung einer eigenen, sicheren Zahlungslösung erreichen Sie uns bitte direkt über die Kontaktangaben, um eine Spende zu vereinbaren.",
    "hero_image_url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/spenden-hero.jpg"
  }$$::jsonb
) on conflict (key) do update set data = excluded.data;

insert into content_blocks (key, data) values (
  'erfolge_intro',
  $${
    "kantone": ["Zürich", "St. Gallen", "Aarau", "Aargau", "Graubünden", "Basel", "Zug", "Luzern", "Schaffhausen", "Bern", "Solothurn"],
    "hero_image_url": "https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/erfolge-hero.jpg"
  }$$::jsonb
) on conflict (key) do update set data = excluded.data;

insert into content_blocks (key, data) values (
  'footer',
  $${
    "vereinsname": "Schutz von Wildtieren",
    "gruendungsjahr": 2023
  }$$::jsonb
) on conflict (key) do update set data = excluded.data;

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------

insert into projects (slug, title, summary, body, status, cover_image_url, images, order_index, published_at) values
(
  'wildtier-schutzinseln',
  'Wildtier-Schutzinseln',
  'Kleine, naturnahe Rückzugsorte für Igel, Zauneidechsen, Amphibien und weitere Arten – dort, wo Wildtieren kaum noch Platz bleibt.',
  $$Unsere Wildtier-Schutzinseln sind kleine, naturnahe Oasen, die dort entstehen, wo Wildtiere kaum noch Platz finden. Durch die zunehmende Bebauung, versiegelte Flächen und gepflegte Gärten verschwinden viele natürliche Lebensräume. In enger Zusammenarbeit mit Gemeinden, Schulen und Fachstellen für Natur- und Umweltschutz errichten wir deshalb gezielt kompakte Rückzugsorte für Igel, Zauneidechsen, Amphibien und viele andere Arten.

Diese Inseln bestehen aus natürlichen Materialien wie Sand, Holz, Wurzeln und Ästen und werden individuell an die Umgebung angepasst. Sie bieten Verstecke, Sonnenplätze und Winterquartiere – sichere Zufluchtsorte, die in unserer Kulturlandschaft immer seltener werden. Gleichzeitig dienen sie als wichtige Verbindungsstellen zwischen bestehenden Lebensräumen und helfen, isolierte Tierpopulationen wieder zu vernetzen.

Ob auf Schularealen, Kirchhöfen oder öffentlichen Grünflächen: Die Wildtier-Schutzinseln fördern nicht nur die Artenvielfalt, sondern auch das Verständnis für Natur und Tierschutz. Kinder und Erwachsene können beobachten, lernen und erleben, wie selbst kleine Flächen Grosses bewirken.

Gemeinsam mit Gemeinden, Schulen und engagierten Menschen schaffen wir so ein schweizweites Netzwerk aus sicheren Lebensräumen – kleine Inseln mit grosser Wirkung.$$,
  'published',
  'https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-01.jpg',
  '["https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-01.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-02.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-03.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-04.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-05.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-06.jpg"]'::jsonb,
  1,
  now()
),
(
  'wildseek',
  'WILDSEEK',
  'Kostenlose Wärmebild- und Videokameras für Landwirtinnen und Landwirte, um Rehkitze vor der Mahd zu retten.',
  $$Als Verein setzen wir uns aktiv für den Schutz junger Wildtiere ein – insbesondere von Rehkitzen, die jedes Jahr während der Mahd durch landwirtschaftliche Maschinen verletzt oder getötet werden. Um dem entgegenzuwirken, stellen wir Landwirtinnen und Landwirten kostenlos hochwertige Wärme- und Videobildkameras zur Verfügung.

Die Kameras lassen sich einfach an Traktoren montieren und ermöglichen es, während der Mahd Rehkitze frühzeitig im hohen Gras zu erkennen. So können sie rechtzeitig aus der Gefahrenzone gebracht werden – ohne Zeitverlust und ohne zusätzlichen Arbeitsaufwand für die Betriebe.

Unsere Initiative verfolgt zwei Ziele: effektiver Tierschutz direkt auf dem Feld, und praktische Entlastung für Landwirtinnen und Landwirte durch moderne Technik. Mit diesem Projekt möchten wir eine Brücke zwischen Landwirtschaft und Naturschutz schlagen. Gemeinsam können wir Leben retten.

Unsere Wärmebild- und Videokameras zur Rehkitzrettung bieten nicht nur technische Unterstützung, sie eröffnen auch Raum für kreative und persönliche Lösungen auf dem Feld. Viele Landwirtinnen und Landwirte entwickeln ihre eigenen Methoden, um die Wildtiere zu schützen – mit Engagement, Einfallsreichtum und grosser Verantwortung gegenüber der Natur.

Ein Beispiel: Einige Betriebe nutzen unsere Wärmebildkamera, um kleinere Felder zu Fuss abzugehen, bevor sie mit der Mahd beginnen. So können sie Rehkitze sicher aufspüren und retten – ganz ohne Drohne oder Traktor. Andere montieren die Kamera flexibel an verschiedene Geräte oder bauen sich eigene Halterungen, um möglichst effizient zu arbeiten.$$,
  'published',
  'https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/wildseek-fotomontage.jpg',
  '["https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/wildseek-fotomontage.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/wildseek-kamera.jpg"]'::jsonb,
  2,
  now()
),
(
  'wildsalzquellen',
  'Wildsalzquellen',
  'Salzquellen in ausgewählten Waldabschnitten decken den Mineralstoffbedarf von Reh, Hirsch und Gämse.',
  $$Als Verein setzen wir uns aktiv für den Schutz und das Wohlbefinden der heimischen Wildtiere ein. Ein zentrales Element unserer Arbeit ist das schweizweite Aufstellen von Salzquellen in ausgewählten Waldabschnitten.

Viele Wildtiere – wie Rehe, Hirsche und Gämsen – sind auf Mineralstoffe wie Salz angewiesen, um ihren Nährstoffbedarf zu decken. Besonders in den Frühjahrs- und Sommermonaten, wenn die Vegetation schnell wächst, kann es zu einem Mangel an Natrium und anderen Mineralien kommen. Unsere Salzquellen helfen, diesen Bedarf auf natürliche Weise zu decken – genau dort, wo die Tiere leben.

Wir platzieren die Salzquellen bewusst in naturnahen, ruhigen Bereichen, um Störungen zu vermeiden und gleichzeitig die Beobachtung und Pflege der Standorte zu ermöglichen. Dabei arbeiten wir eng mit Förstern, Wildhütern und lokalen Behörden zusammen.

Unser Ziel ist es, einen nachhaltigen Beitrag zur Gesundheit der Wildtiere zu leisten und gleichzeitig ein besseres Verständnis für die Bedürfnisse unserer tierischen Mitbewohner zu schaffen.

Hinweis: Seit Dezember 2025 befindet sich dieses Projekt in einer strategischen Pause.$$,
  'published',
  'https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/wildsalzquellen-foto1.jpg',
  '["https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/wildsalzquellen-foto1.jpg"]'::jsonb,
  3,
  now()
),
(
  'wildtierschonender-weidezaun',
  'Wildtierschonender Weidezaun',
  'Kostenlose, gut sichtbare Schafzäune schützen Nutztiere vor Raubtieren, ohne Wildtiere zu gefährden – Schutz statt Abschuss.',
  $$Dieses Projekt verfolgt drei Hauptziele: einen wildtierschonenden Weidezaun bereitzustellen, der durch geeignete Farben, gut sichtbare Flatterbänder und eine korrekte Installation von Wildtieren zuverlässig erkannt wird; einen mindestens 1,50 m hohen bzw. wolfssicheren Weidezaun zu ermöglichen, damit Nutztiere geschützt werden und keine Forderungen nach Wolfsabschüssen entstehen; und Nutztiere effektiv zu schützen, ohne andere Wildtiere zu gefährden.

Als Verein setzen wir uns für einen verantwortungsvollen Umgang mit Natur und Tierwelt ein. Unser Anliegen ist es, Nutztiere zu schützen, ohne Raubtiere wie den Wolf für Konflikte verantwortlich zu machen.

In der Schweiz erhalten Bäuerinnen und Bauern für Herdenschutzmassnahmen häufig nur begrenzt finanzielle Unterstützung. Besonders bei der Anschaffung von Schafzäunen tragen Landwirtinnen und Landwirte einen erheblichen Teil der Kosten selbst. Das führt in der Praxis oft zu Frust und zu Forderungen nach Wolfsabschüssen. Um hier gezielt anzusetzen, stellen wir Schafzäune kostenlos zur Verfügung. Unser Grundgedanke: Schutz statt Abschuss.

Wir achten darauf, dass unsere Massnahmen sowohl die Sicherheit der Nutztiere als auch die der Wildtiere berücksichtigen. Die Zäune sind mit Reflektoren ausgestattet, damit sie im Dunkeln rechtzeitig wahrgenommen werden und keine Gefahr des Verhedderns besteht.

Für eine wildtiersensible Umsetzung setzen wir auf: blau-weisse Zaunlitzen, die von Wildtieren besonders gut erkannt werden; blau-weisse Flatterbänder in regelmässigen Abständen, um die Sichtbarkeit weiter zu erhöhen; sowie regelmässige Wartung und Instandhaltung, damit keine unnötigen Risiken entstehen und die Zäune dauerhaft zuverlässig funktionieren.

Unser Ziel ist ein Herdenschutz, der wirksam ist, aber gleichzeitig Rücksicht auf die gesamte Tierwelt nimmt.$$,
  'published',
  'https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/weidezaun-installiert.jpg',
  '["https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/weidezaun-installiert.jpg"]'::jsonb,
  4,
  now()
),
(
  'biberdamm-ueberwachung',
  'Biberdamm-Überwachung',
  'Beobachtung der Biberaktivität an einem Biberdamm mittels Wildkamera.',
  $$[Information muss ergänzt oder bestätigt werden] Für dieses Projekt lag auf der bisherigen Website noch keine ausführliche Beschreibung vor. Belegt sind Fotos einer Wildkamera-Überwachung an einem Biberdamm aus dem Jahr 2025. Eine ausführliche Projektbeschreibung wird nachgereicht, sobald sie vom Verein bestätigt ist.$$,
  'published',
  'https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-02-wildkamera.jpg',
  '["https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-01.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-02-wildkamera.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-03.jpg","https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-04-wildkamera.jpg"]'::jsonb,
  5,
  now()
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- news / Aktuelles
-- ---------------------------------------------------------------------

insert into news (slug, title, summary, body, status, cover_image_url, order_index, published_at, date_label) values
(
  'eidgenoessisches-turnfest-lausanne-2025',
  'Eidgenössisches Turnfest Lausanne (ETF) 2025',
  'Vereinspräsident Rudolf Locher hat ein Turnteam aus Gossau am Eidgenössischen Turnfest in Lausanne mit gesponserten T-Shirts unterstützt.',
  $$Vereinspräsident Rudolf Locher hat ein Turnteam aus Gossau am Eidgenössischen Turnfest in Lausanne 2025 mit gesponserten T-Shirts unterstützt.

Das grösste Sportfest der Schweiz, mit über 300'000 Besucherinnen und Besuchern, bot eine einmalige Gelegenheit, den Verein «Schutz von Wildtieren» sichtbar zu machen. Mit überschaubarem finanziellem Aufwand konnte so grosse Aufmerksamkeit für unsere Arbeit erzielt werden – eine einfache, aber sehr wirkungsvolle Form der Öffentlichkeitsarbeit.

Wir bedanken uns herzlich beim Team für ihren Einsatz und für die Bilder, die zeigen, wie Engagement für den Tierschutz auch durch kreative Wege sichtbar gemacht werden kann.$$,
  'published',
  'https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/etf-lausanne-gruppenfoto.jpg',
  1,
  now(),
  '2025'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- success_entries / Erfolge
-- ---------------------------------------------------------------------

insert into success_entries (project_slug, title, period_label, value_label, order_index, status) values
('wildseek', 'WILDSEEK-Projekt', 'April 2023 – Oktober 2024', '40 Systeme finanziert', 1, 'published'),
('wildseek', 'WILDSEEK-Projekt', 'April 2023 – Januar 2025', '64 Systeme finanziert', 2, 'published'),
('wildseek', 'WILDSEEK-Projekt', 'April 2023 – Mai 2025', '72 Systeme finanziert', 3, 'published'),
('wildseek', 'WILDSEEK-Projekt', 'April 2023 – Juni 2025', '79 Systeme finanziert', 4, 'published'),
('wildseek', 'WILDSEEK-Projekt', 'April 2023 – August 2025', '84 Systeme finanziert', 5, 'published'),
('wildseek', 'WILDSEEK-Projekt', 'April 2023 – Januar 2026', '97 Systeme finanziert', 6, 'published'),
('wildsalzquellen', 'Wildsalzquellen', 'September 2024 – Januar 2025', '15 Salzquellen finanziert', 1, 'published'),
('wildsalzquellen', 'Wildsalzquellen', 'September 2024 – April 2025', '17 Salzquellen finanziert', 2, 'published'),
('wildsalzquellen', 'Wildsalzquellen', 'September 2024 – Juni 2025', '22 Salzquellen finanziert', 3, 'published'),
('wildsalzquellen', 'Wildsalzquellen', null, 'Strategische Projektpause seit Dezember 2025', 4, 'published'),
('wildtierschonender-weidezaun', 'Wildtierschonende Weidezäune', 'Januar 2025 – April 2025', '20 Hektaren Fläche (8''000 m Zaunlänge) Herdenschutzzaun finanziert', 1, 'published');

-- ---------------------------------------------------------------------
-- gallery_images / Bilder
-- ---------------------------------------------------------------------

insert into gallery_images (url, alt_text, category, year, order_index, status) values
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-01.jpg', 'Wildtier-Schutzinsel', 'Wildtier-Schutzinseln', '2026', 1, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-02.jpg', 'Wildtier-Schutzinsel', 'Wildtier-Schutzinseln', '2026', 2, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-03.jpg', 'Wildtier-Schutzinsel', 'Wildtier-Schutzinseln', '2026', 3, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-04.jpg', 'Wildtier-Schutzinsel', 'Wildtier-Schutzinseln', '2026', 4, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-05.jpg', 'Wildtier-Schutzinsel', 'Wildtier-Schutzinseln', '2026', 5, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biodiv-06.jpg', 'Wildtier-Schutzinsel', 'Wildtier-Schutzinseln', '2026', 6, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-01.jpg', 'Biberdamm', 'Biberdamm-Überwachung', '2025', 7, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-02-wildkamera.jpg', 'Wildkamera-Aufnahme am Biberdamm', 'Biberdamm-Überwachung', '2025', 8, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-03.jpg', 'Biberdamm', 'Biberdamm-Überwachung', '2025', 9, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/biberdamm-04-wildkamera.jpg', 'Wildkamera-Aufnahme am Biberdamm', 'Biberdamm-Überwachung', '2025', 10, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/weidezaun-installiert.jpg', 'Installierter wildtierschonender Weidezaun', 'Wildtierschonender Weidezaun', '2025', 11, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/wildsalzquellen-foto1.jpg', 'Wildsalzquelle im Wald', 'Wildsalzquellen', '2025', 12, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/etf-lausanne-01.jpg', 'Eidgenössisches Turnfest Lausanne 2025', 'ETF Lausanne', '2025', 13, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/etf-lausanne-02.jpg', 'Eidgenössisches Turnfest Lausanne 2025', 'ETF Lausanne', '2025', 14, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/etf-lausanne-gruppenfoto.jpg', 'Gruppenfoto Eidgenössisches Turnfest Lausanne 2025', 'ETF Lausanne', '2025', 15, 'published'),
('https://rfxinyirkhiyhnffbecx.supabase.co/storage/v1/object/public/media/originals/etf-lausanne-gruppenfoto2.jpg', 'Gruppenfoto Eidgenössisches Turnfest Lausanne 2025', 'ETF Lausanne', '2025', 16, 'published')
on conflict do nothing;
