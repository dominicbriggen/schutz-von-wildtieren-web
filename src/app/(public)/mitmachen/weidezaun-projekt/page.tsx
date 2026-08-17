import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { FenceForm } from "@/components/forms/fence-form";

export const metadata: Metadata = {
  title: "Rückmeldung zu unserem wildtierschonenden Zaunsystem",
  robots: { index: false, follow: true },
};

export default function WeidezaunProjektPage() {
  return (
    <>
      <PageHero
        eyebrow="Rückmeldung"
        title="Rückmeldung zu unserem wildtierschonenden Zaunsystem"
        lead="Mit Ihrer Rückmeldung dokumentieren wir die eingesetzten Zaunsysteme und ihre Erfahrungen in der Praxis. Die Angaben helfen uns, die Wirkung des Projekts langfristig nachvollziehbar zu erfassen und weiterzuentwickeln."
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <FenceForm group="project" />
      </div>
    </>
  );
}
