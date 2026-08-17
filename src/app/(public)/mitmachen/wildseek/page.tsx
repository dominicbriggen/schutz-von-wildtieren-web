import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { getMountingTypes } from "@/lib/content";
import { WildseekForm } from "./wildseek-form";

export const metadata: Metadata = {
  title: "WILDSEEK-Einsatz melden",
  // Form pages carry no public content worth indexing and may collect personal
  // data on submit — keep them out of the index (the /mitmachen hub stays in).
  robots: { index: false, follow: true },
};

export default async function WildseekMeldenPage() {
  const mountingTypes = await getMountingTypes();

  return (
    <>
      <PageHero
        eyebrow="Rückmeldung"
        title="WILDSEEK-Einsatz melden"
        lead="Mit Ihrer Rückmeldung helfen Sie uns, die Nutzung von WILDSEEK, gerettete Tiere und unterschiedliche Montagearten besser zu dokumentieren und das Projekt weiterzuentwickeln."
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <WildseekForm mountingTypes={mountingTypes} />
      </div>
    </>
  );
}
