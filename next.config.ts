import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Moderne, effiziente Formate (AVIF bevorzugt, WebP als Fallback).
    formats: ["image/avif", "image/webp"],
    // Erlaubte Qualitätsstufen für den next/image-Optimizer. Höher als der
    // Standard (75), um Projekt-, Galerie- und Hero-Bilder sichtbar schärfer
    // auszuliefern, ohne die Dateigrösse zu sprengen.
    qualities: [75, 82, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Umbenennung Wildtier-Schutzinseln -> Biodiversitätsinseln:
        // alter Slug wird dauerhaft (301) auf den neuen weitergeleitet,
        // damit bestehende Links und Suchmaschinen-Einträge erhalten bleiben.
        source: "/projekte/wildtier-schutzinseln",
        destination: "/projekte/biodiversitaetsinseln",
        permanent: true,
      },
      {
        // Kanonisierung: www dauerhaft (308) auf die Hauptdomain (apex)
        // weiterleiten. Greift ausschliesslich, wenn der Host www.* ist –
        // bleibt daher wirkungslos, solange www noch nicht auf Vercel zeigt.
        source: "/:path*",
        has: [{ type: "host", value: "www.schutz-von-wildtieren.ch" }],
        destination: "https://schutz-von-wildtieren.ch/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
