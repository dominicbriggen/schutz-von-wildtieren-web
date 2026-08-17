"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function AdminNote({
  initial,
  action,
}: {
  initial: string;
  action: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-2">
      <textarea
        value={note}
        rows={4}
        placeholder="Interne Notiz (nur im Verwaltungsbereich sichtbar)"
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await action(note);
              setSaved(true);
            })
          }
        >
          {pending ? "Speichern…" : "Notiz speichern"}
        </Button>
        {saved && <span className="text-sm text-muted-foreground">Gespeichert.</span>}
      </div>
    </div>
  );
}
