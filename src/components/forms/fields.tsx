import * as React from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Editorial, mobile-first form fields for the /mitmachen forms. Large touch
// targets (h-11 / text-base), quiet borders, no cards or heavy shadows.

const CONTROL =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

type Option = { value: string; label: string };

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-foreground">
      <span>{children}</span>
      {required ? (
        <span className="text-destructive" aria-hidden="true">
          {" "}
          *
        </span>
      ) : (
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (optional)
        </span>
      )}
    </Label>
  );
}

// Section wrapper: a titled group of fields, separated by a hairline.
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-t border-border/70 pt-8 first:border-t-0 first:pt-0",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-primary sm:text-xl">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

// Two-column responsive grid for grouping related short fields.
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">{children}</div>
  );
}

export function TextField({
  label,
  name,
  required,
  type = "text",
  hint,
  placeholder,
  inputMode,
  autoComplete,
  defaultValue,
  min,
  step,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  hint?: React.ReactNode;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  defaultValue?: string | number;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        min={min}
        step={step}
        className={CONTROL}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextareaField({
  label,
  name,
  required,
  hint,
  placeholder,
  rows = 4,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: React.ReactNode;
  placeholder?: string;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={cn(CONTROL, "h-auto min-h-[6rem] py-2.5 leading-relaxed")}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NativeSelectField({
  label,
  name,
  required,
  options,
  placeholder = "Bitte wählen",
  hint,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: ReadonlyArray<Option>;
  placeholder?: string;
  hint?: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const controlled = value !== undefined;
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          {...(controlled
            ? { value, onChange: (e) => onChange?.(e.target.value) }
            : { defaultValue: defaultValue ?? "" })}
          className={cn(CONTROL, "appearance-none pr-10")}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Uncontrolled segmented radio group (e.g. maintenance: Ja / Teilweise / Nein).
export function SegmentedField({
  label,
  name,
  options,
  required,
  hint,
}: {
  label: string;
  name: string;
  options: ReadonlyArray<Option>;
  required?: boolean;
  hint?: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        <span>{label}</span>
        {!required && (
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="cursor-pointer rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors select-none has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </fieldset>
  );
}

export function CheckboxField({
  name,
  required,
  defaultChecked,
  children,
}: {
  name: string;
  required?: boolean;
  defaultChecked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground select-none">
      <input
        type="checkbox"
        name={name}
        required={required}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-5 shrink-0 rounded border-input text-primary accent-[var(--primary)] focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <span>{children}</span>
    </label>
  );
}

// Submit button with a pending state, styled as the brand action.
export function SubmitButton({
  label,
  pending,
}: {
  label: string;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        buttonVariants({ variant: "brand", size: "lg" }),
        "w-full sm:w-auto"
      )}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Wird übermittelt…
        </>
      ) : (
        label
      )}
    </button>
  );
}

// Prominent, accessible error summary shown above the submit button.
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
    >
      {message}
    </p>
  );
}
