import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://schutz-von-wildtieren-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Schutz von Wildtieren",
    template: "%s | Schutz von Wildtieren",
  },
  description:
    "Der Verein Schutz von Wildtieren setzt sich für Schweizer Wildtiere und ihre Lebensräume ein – mit konkreten Projekten wie WILDSEEK, Wildsalzquellen und wildtierschonenden Weidezäunen.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "Schutz von Wildtieren",
    title: "Schutz von Wildtieren",
    description:
      "Gemeinsam für die Natur und unsere Wildtiere – Projekte, Erfolge und Möglichkeiten zu helfen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH" className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
