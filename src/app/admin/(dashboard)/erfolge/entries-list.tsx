"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { deleteSuccessEntry, toggleSuccessEntryVisibility } from "@/lib/actions/success-entries";
import type { SuccessEntry } from "@/lib/types";
import { EntryDialog } from "./entry-dialog";

export function EntriesList({ entries }: { entries: SuccessEntry[] }) {
  const [, startTransition] = useTransition();

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Es sind noch keine Erfolge erfasst.</p>;
  }

  const byGroup = new Map<string, SuccessEntry[]>();
  for (const entry of entries) {
    const key = entry.title;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(entry);
  }

  return (
    <div className="space-y-8">
      {Array.from(byGroup.entries()).map(([title, groupEntries]) => (
        <div key={title}>
          <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
            {groupEntries.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  {entry.period_label && (
                    <p className="text-xs text-muted-foreground">{entry.period_label}</p>
                  )}
                  <p className="font-medium text-foreground">{entry.value_label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    defaultChecked={entry.status !== "hidden"}
                    onCheckedChange={(checked) =>
                      startTransition(() => toggleSuccessEntryVisibility(entry.id, !checked))
                    }
                    aria-label="Sichtbar"
                  />
                  <span className="text-xs text-muted-foreground">Sichtbar</span>
                </div>
                <EntryDialog entry={entry} triggerLabel="Bearbeiten" />
                <DeleteConfirmDialog
                  itemLabel={entry.value_label}
                  onConfirm={() => deleteSuccessEntry(entry.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
