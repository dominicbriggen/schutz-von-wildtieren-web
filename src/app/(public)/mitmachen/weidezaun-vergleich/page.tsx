import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { FenceForm } from "@/components/forms/fence-form";

export const metadata: Metadata = {
  title: "Erfahrungen mit bestehenden Weidezäunen melden",
  robots: { index: false, follow: true },
};

export default function WeidezaunVergleichPage() {
  return (
    <>
      <PageHero
        eyebrow="Vergleichsdaten"
        title="Erfahrungen mit bestehenden Weidezäunen melden"
        lead="Auch wenn Sie nicht an unserem Projekt teilnehmen, sind Ihre Erfahrungen wertvoll. Mit vergleichbaren Angaben zu bestehenden Zaunsystemen helfen Sie uns, die aktuelle Situation in der Praxis besser zu erfassen."
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <FenceForm group="comparison" />
      </div>
    </>
  );
}
