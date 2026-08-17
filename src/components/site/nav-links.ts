// Sichtbare Bezeichnungen wurden auf die künftige Struktur umgestellt; die
// URLs bleiben bewusst unverändert (risikoarm, keine gebrochenen Links):
//   "Wirkung"   -> /erfolge
//   "Über uns"  -> /verein
// /bilder und /kontakt sind nicht mehr in der Hauptnavigation (Kontakt über
// Footer/CTAs; Bilder werden später in Wirkung/Projekte/Aktuelles integriert).
// /mitmachen ist neu vorbereitet (noch ohne Formulare).
// "Unterstützen" ist nicht Teil dieser Liste, sondern wird im Header als
// hervorgehobener CTA-Button separat gerendert.
export const NAV_LINKS = [
  { href: "/", label: "Startseite" },
  { href: "/projekte", label: "Projekte" },
  { href: "/erfolge", label: "Wirkung" },
  { href: "/aktuelles", label: "Aktuelles" },
  { href: "/verein", label: "Über uns" },
  { href: "/mitmachen", label: "Mitmachen" },
] as const;
