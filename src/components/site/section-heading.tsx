import { cn } from "@/lib/utils";

type Tone = "default" | "onPrimary";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: Tone;
  className?: string;
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  const Title = as;
  return (
    <div
      className={cn(
        center && "mx-auto text-center",
        description ? "max-w-2xl" : "max-w-3xl",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow",
            center && "eyebrow-center",
            tone === "onPrimary" && "text-[#d8b871]"
          )}
        >
          {eyebrow}
        </p>
      )}
      <Title
        className={cn(
          "mt-3 text-[1.75rem] leading-[1.15] sm:text-4xl",
          tone === "onPrimary" ? "text-primary-foreground" : "text-primary"
        )}
      >
        {title}
      </Title>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "onPrimary"
              ? "text-primary-foreground/75"
              : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
