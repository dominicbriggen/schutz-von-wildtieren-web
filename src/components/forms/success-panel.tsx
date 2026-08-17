import Link from "next/link";
import { Check } from "lucide-react";

// Shown in place of the form after a successful submission. No external
// redirect — the visitor stays on the site.
export function SuccessPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="mx-auto max-w-xl rounded-xl border border-primary/20 bg-primary/[0.04] p-8 text-center sm:p-10"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-primary">{title}</h2>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
        {children}
      </p>
      <Link
        href="/mitmachen"
        className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2.5"
      >
        Zurück zur Übersicht
      </Link>
    </div>
  );
}
