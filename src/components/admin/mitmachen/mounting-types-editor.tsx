"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveMountingTypes } from "@/lib/actions/mitmachen-admin";

export function MountingTypesEditor({ initial }: { initial: string[] }) {
  const [items, setItems] = useState<string[]>(initial.length ? initial : [""]);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const update = (i: number, v: string) =>
    setItems((arr) => arr.map((x, idx) => (idx === i ? v : x)));
  const add = () => setItems((arr) => [...arr, ""]);
  const remove = (i: number) =>
    setItems((arr) => (arr.length === 1 ? [""] : arr.filter((_, idx) => idx !== i)));

  return (
    <div className="space-y-3">
      {items.map((value, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={value}
            placeholder="Bezeichnung der Montageart"
            onChange={(e) => {
              update(i, e.target.value);
              setSaved(false);
            }}
            className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <button
            type="button"
            onClick={() => {
              remove(i);
              setSaved(false);
            }}
            aria-label="Montageart entfernen"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-standard hover:gap-2"
        >
          <Plus className="size-4" /> Montageart hinzufügen
        </button>
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await saveMountingTypes(items);
              setSaved(true);
            })
          }
        >
          {pending ? "Speichern…" : "Liste speichern"}
        </Button>
        {saved && <span className="text-sm text-muted-foreground">Gespeichert.</span>}
      </div>
    </div>
  );
}
