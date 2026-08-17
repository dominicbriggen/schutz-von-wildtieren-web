"use client";

import { cn } from "@/lib/utils";

// Controlled Ja/Nein toggle. The parent keeps the boolean so it can reveal or
// hide dependent fields; the choice is submitted via a hidden input as
// "true" / "false" / "" (unanswered).
export function YesNoField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  const options: { v: boolean; l: string }[] = [
    { v: true, l: "Ja" },
    { v: false, l: "Nein" },
  ];
  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 text-sm font-medium text-foreground">
        {label}
      </legend>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={String(o.v)}
            type="button"
            onClick={() => onChange(o.v)}
            aria-pressed={value === o.v}
            className={cn(
              "min-w-20 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors",
              value === o.v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-card text-foreground hover:border-primary/40"
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
      <input
        type="hidden"
        name={name}
        value={value === null ? "" : value ? "true" : "false"}
      />
    </fieldset>
  );
}
