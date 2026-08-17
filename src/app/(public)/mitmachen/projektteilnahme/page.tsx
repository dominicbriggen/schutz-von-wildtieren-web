import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { InterestForm } from "./interest-form";

export const metadata: Metadata = {
  title: "Interesse an einer Projektteilnahme",
  robots: { index: false, follow: true },
};

export default function ProjektteilnahmePage() {
  return (
    <>
      <PageHero
        eyebrow="Projektteilnahme"
        title="Interesse an einer Projektteilnahme"
        lead="Sie möchten mit Ihrem Betrieb an einem unserer Projekte teilnehmen? Senden Sie uns Ihre Angaben. Wir nehmen geeignete Betriebe in unsere Interessenten- bzw. Warteliste auf und melden uns, sobald eine Teilnahme möglich ist."
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <InterestForm />
      </div>
    </>
  );
}
