export function PageHero({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{title}</h1>
        {lead && (
          <p className="mt-3 max-w-2xl text-balance text-primary-foreground/80">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
