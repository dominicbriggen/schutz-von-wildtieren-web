import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DetailBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-standard hover:text-foreground"
    >
      <ArrowLeft className="size-4" /> {label}
    </Link>
  );
}

export function DetailGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

export function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm whitespace-pre-wrap text-foreground">
        {children}
      </dd>
    </div>
  );
}

export function ConsentBadge({ consent }: { consent: boolean }) {
  return consent ? (
    <Badge variant="default">Veröffentlichung erlaubt</Badge>
  ) : (
    <Badge variant="outline">Nur interne Verwendung</Badge>
  );
}

export type SignedImage = {
  url: string | null;
  name?: string;
  type?: string;
};

function canPreview(type?: string): boolean {
  return !!type && /^image\/(jpeg|png|webp)$/.test(type);
}

export function SignedImageGrid({
  images,
  consent,
}: {
  images: SignedImage[];
  consent: boolean;
}) {
  if (images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Keine Bilder übermittelt.</p>
    );
  }
  return (
    <div>
      <div className="mb-3">
        <ConsentBadge consent={consent} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-lg border border-border bg-muted"
          >
            <div className="relative flex aspect-square items-center justify-center">
              {img.url && canPreview(img.type) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={img.name ?? `Bild ${i + 1}`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 p-3 text-center text-muted-foreground">
                  <ImageOff className="size-6" />
                  <span className="text-[0.65rem] leading-tight break-all">
                    {img.name ?? "Bild"}
                  </span>
                </div>
              )}
            </div>
            <figcaption className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5 text-xs">
              <span className="truncate text-muted-foreground" title={img.name}>
                {img.name ?? "Bild"}
              </span>
              {img.url && (
                <a
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-medium text-brand hover:underline"
                >
                  Öffnen
                </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Bilder liegen in einem privaten Speicher. Die Links sind zeitlich
        begrenzt gültig (Signed URLs).
      </p>
    </div>
  );
}
