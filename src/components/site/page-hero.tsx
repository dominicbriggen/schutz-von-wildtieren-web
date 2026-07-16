export function PageHero({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-balance text-base text-primary-foreground/80 sm:text-lg">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
