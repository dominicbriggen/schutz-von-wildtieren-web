"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { createSuccessEntry, updateSuccessEntry } from "@/lib/actions/success-entries";
import type { SuccessEntry } from "@/lib/types";

export function EntryDialog({
  entry,
  triggerLabel,
}: {
  entry?: SuccessEntry;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = entry
        ? await updateSuccessEntry(entry.id, formData)
        : await createSuccessEntry(formData);
      if (result.status === "error") {
        toast.error(result.message ?? "Fehler beim Speichern.");
        return;
      }
      toast.success("Erfolg gespeichert.");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={entry ? "outline" : "default"} size={entry ? "sm" : "default"} />}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Erfolg bearbeiten" : "Neuer Erfolg"}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Projekt / Bereich</Label>
            <Input
              id="title"
              name="title"
              defaultValue={entry?.title}
              placeholder="z. B. WILDSEEK-Projekt"
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="project_slug">Link-Name des zugehörigen Projekts (optional)</Label>
            <Input
              id="project_slug"
              name="project_slug"
              defaultValue={entry?.project_slug ?? ""}
              placeholder="z. B. wildseek"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Muss exakt dem Link-Namen des Projekts entsprechen, damit der Erfolg dort
              angezeigt wird. Leer lassen für allgemeine Erfolge.
            </p>
          </div>
          <div>
            <Label htmlFor="period_label">Zeitraum (optional)</Label>
            <Input
              id="period_label"
              name="period_label"
              defaultValue={entry?.period_label ?? ""}
              placeholder="z. B. April 2023 – Januar 2026"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="value_label">Ergebnis</Label>
            <Input
              id="value_label"
              name="value_label"
              defaultValue={entry?.value_label}
              placeholder="z. B. 97 Systeme finanziert"
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="order_index">Reihenfolge</Label>
            <Input
              id="order_index"
              name="order_index"
              type="number"
              defaultValue={entry?.order_index ?? 0}
              className="mt-1.5"
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Abbrechen
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Wird gespeichert…" : "Speichern"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
