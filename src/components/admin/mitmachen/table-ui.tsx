import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <th className={cn("px-3 py-2.5 font-medium", className)}>{children}</th>;
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-3 py-3 align-top", className)}>{children}</td>;
}

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: [string, number][];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {rows.map(([label, count]) => (
            <li key={label} className="flex justify-between py-1.5 text-sm">
              <span className="text-foreground">{label}</span>
              <span className="font-medium text-muted-foreground">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GroupBadge({ group }: { group: "project" | "comparison" }) {
  return group === "project" ? (
    <Badge variant="default">Projekt</Badge>
  ) : (
    <Badge variant="secondary">Vergleich</Badge>
  );
}

export function FilterSelect({
  name,
  label,
  value,
  options,
  allLabel = "Alle",
}: {
  name: string;
  label: string;
  value?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  allLabel?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <select
        name={name}
        defaultValue={value ?? ""}
        className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterDate({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <input
        type="date"
        name={name}
        defaultValue={value ?? ""}
        className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </label>
  );
}

export function FilterNumber({
  name,
  label,
  value,
  placeholder,
}: {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <input
        type="number"
        name={name}
        defaultValue={value ?? ""}
        placeholder={placeholder}
        inputMode="numeric"
        className="h-9 w-28 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </label>
  );
}
