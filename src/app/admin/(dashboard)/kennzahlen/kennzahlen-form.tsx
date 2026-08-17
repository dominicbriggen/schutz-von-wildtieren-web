"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SaveButton } from "@/components/admin/save-button";
import { updateProjectStats, type FormState } from "@/lib/actions/content-blocks";
import type { ProjectStat, ProjectStatus } from "@/lib/types";

const initialState: FormState = { status: "idle" };

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "aktiv", label: "Aktiv" },
  { value: "pausiert", label: "Pausiert" },
  { value: "archiviert", label: "Archiviert" },
];

export function KennzahlenForm({
  entries: initialEntries,
  titles,
}: {
  entries: ProjectStat[];
  titles: Record<string, string>;
}) {
  const [state, formAction] = useActionState(updateProjectStats, initialState);
  const [entries, setEntries] = useState<ProjectStat[]>(initialEntries);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message ?? "Fehler beim Speichern.");
  }, [state]);

  function update(index: number, patch: Partial<ProjectStat>) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <input type="hidden" name="entries" value={JSON.stringify(entries)} />
      <p className="text-sm text-muted-foreground">
        Diese Kennzahlen werden zentral gepflegt und automatisch auf Startseite,
        Projektseiten und der Seite „Wirkung“ verwendet. Eine Änderung hier wirkt
        sich überall aus.
      </p>

      {entries.map((entry, i) => (
        <fieldset
          key={entry.slug}
          className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-card"
        >
          <legend className="flex items-center gap-2 px-1 text-base font-semibold text-primary">
            {titles[entry.slug] ?? entry.slug}
          </legend>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <Switch
                id={`main-${i}`}
                checked={entry.is_main}
                onCheckedChange={(v) => update(i, { is_main: Boolean(v) })}
              />
              <Label htmlFor={`main-${i}`}>Aktuelles Hauptprojekt</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`status-${i}`}>Status</Label>
              <select
                id={`status-${i}`}
                value={entry.status}
                onChange={(e) => update(i, { status: e.target.value as ProjectStatus })}
                className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor={`value-${i}`}>Wert</Label>
              <Input
                id={`value-${i}`}
                value={entry.metric_value ?? ""}
                onChange={(e) => update(i, { metric_value: e.target.value })}
                placeholder="z. B. 117"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor={`unit-${i}`}>Einheit</Label>
              <Input
                id={`unit-${i}`}
                value={entry.metric_unit ?? ""}
                onChange={(e) => update(i, { metric_unit: e.target.value })}
                placeholder="z. B. Systeme"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor={`asof-${i}`}>Stichtag</Label>
              <Input
                id={`asof-${i}`}
                value={entry.as_of ?? ""}
                onChange={(e) => update(i, { as_of: e.target.value })}
                placeholder="z. B. Juli 2026"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`label-${i}`}>Beschriftung</Label>
            <Input
              id={`label-${i}`}
              value={entry.metric_label ?? ""}
              onChange={(e) => update(i, { metric_label: e.target.value })}
              placeholder="z. B. finanzierte Systeme"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor={`statuslabel-${i}`}>Status-Hinweis (optional)</Label>
            <Input
              id={`statuslabel-${i}`}
              value={entry.status_label ?? ""}
              onChange={(e) => update(i, { status_label: e.target.value })}
              placeholder="z. B. Projektpause seit Dezember 2025"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor={`notes-${i}`}>Zusätzliche Hinweise (eine Zeile pro Hinweis)</Label>
            <Textarea
              id={`notes-${i}`}
              value={(entry.notes ?? []).join("\n")}
              onChange={(e) =>
                update(i, {
                  notes: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                })
              }
              rows={2}
              className="mt-1.5"
            />
          </div>
        </fieldset>
      ))}

      <SaveButton />
    </form>
  );
}
