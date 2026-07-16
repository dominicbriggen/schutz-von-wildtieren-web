export function PageHero({
  title,
  lead,
  eyebrow,
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* dezente, ruhige Flächenabstufung – kein greller Verlauf */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(120%_120%_at_15%_0%,color-mix(in_oklch,var(--primary),white_8%)_0%,transparent_55%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="eyebrow text-[#d8b871]">{eyebrow ?? "Verein Schutz von Wildtieren"}</p>
        <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] sm:text-5xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-2xl text-balance text-base text-primary-foreground/80 sm:text-lg">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
