"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { OUTCOMES } from "@/lib/forms/constants";
import { cn } from "@/lib/utils";

const ROW_CONTROL =
  "h-11 rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2"
    >
      <Plus className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Zeile entfernen"
      className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
    >
      <Trash2 className="size-4" aria-hidden="true" />
    </button>
  );
}

// ── Rescued animals: species + count ────────────────────────────────────
type AnimalRow = { species: string; count: string };

export function AnimalCountRows({
  name,
  disabled,
  speciesPlaceholder = "z. B. Rehkitz",
}: {
  name: string;
  disabled?: boolean;
  speciesPlaceholder?: string;
}) {
  const [rows, setRows] = useState<AnimalRow[]>([{ species: "", count: "" }]);

  const update = (i: number, patch: Partial<AnimalRow>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setRows((r) => [...r, { species: "", count: "" }]);
  const remove = (i: number) =>
    setRows((r) => (r.length === 1 ? [{ species: "", count: "" }] : r.filter((_, idx) => idx !== i)));

  const serialized = disabled
    ? []
    : rows
        .map((r) => ({ species: r.species.trim(), count: Number(r.count) }))
        .filter((r) => r.species !== "" && Number.isFinite(r.count) && r.count > 0);

  return (
    <div className={cn("space-y-3", disabled && "pointer-events-none opacity-40")}>
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            aria-label="Tierart"
            className={cn(ROW_CONTROL, "min-w-0 flex-1")}
            placeholder={speciesPlaceholder}
            value={row.species}
            disabled={disabled}
            onChange={(e) => update(i, { species: e.target.value })}
          />
          <input
            aria-label="Anzahl"
            type="number"
            inputMode="numeric"
            min={1}
            className={cn(ROW_CONTROL, "w-24 text-center")}
            placeholder="Anzahl"
            value={row.count}
            disabled={disabled}
            onChange={(e) => update(i, { count: e.target.value })}
          />
          <RemoveButton onClick={() => remove(i)} />
        </div>
      ))}
      {!disabled && (
        <AddButton onClick={add} label="Weitere Tierart hinzufügen" />
      )}
      <input type="hidden" name={name} value={JSON.stringify(serialized)} />
    </div>
  );
}

// ── Entanglement events: species + count + outcome ──────────────────────
type EventRow = { species: string; count: string; outcome: string };

export function EntanglementRows({ name }: { name: string }) {
  const [rows, setRows] = useState<EventRow[]>([
    { species: "", count: "", outcome: "" },
  ]);

  const update = (i: number, patch: Partial<EventRow>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () =>
    setRows((r) => [...r, { species: "", count: "", outcome: "" }]);
  const remove = (i: number) =>
    setRows((r) =>
      r.length === 1
        ? [{ species: "", count: "", outcome: "" }]
        : r.filter((_, idx) => idx !== i)
    );

  const serialized = rows
    .map((r) => ({
      species: r.species.trim(),
      count: Number(r.count),
      outcome: r.outcome,
    }))
    .filter(
      (r) =>
        r.species !== "" &&
        Number.isFinite(r.count) &&
        r.count > 0 &&
        ["unverletzt", "verletzt", "verendet"].includes(r.outcome)
    );

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_5.5rem_10rem_auto]"
        >
          <input
            aria-label="Wildtierart"
            className={cn(ROW_CONTROL, "min-w-0")}
            placeholder="Tierart"
            value={row.species}
            onChange={(e) => update(i, { species: e.target.value })}
          />
          <input
            aria-label="Anzahl Tiere"
            type="number"
            inputMode="numeric"
            min={1}
            className={cn(ROW_CONTROL, "text-center")}
            placeholder="Anzahl"
            value={row.count}
            onChange={(e) => update(i, { count: e.target.value })}
          />
          <select
            aria-label="Ausgang"
            className={cn(ROW_CONTROL, "appearance-none")}
            value={row.outcome}
            onChange={(e) => update(i, { outcome: e.target.value })}
          >
            <option value="" disabled>
              Ausgang …
            </option>
            {OUTCOMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <RemoveButton onClick={() => remove(i)} />
        </div>
      ))}
      <AddButton onClick={add} label="Weiteres Ereignis hinzufügen" />
      <input type="hidden" name={name} value={JSON.stringify(serialized)} />
    </div>
  );
}
