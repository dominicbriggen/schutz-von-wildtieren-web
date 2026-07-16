"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function DeleteConfirmDialog({
  itemLabel,
  onConfirm,
  triggerLabel,
}: {
  itemLabel: string;
  onConfirm: () => Promise<void>;
  /** If provided, renders a labeled text button instead of the default icon-only button. */
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerLabel ? (
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <Trash2 className="size-4 text-destructive" />
          {triggerLabel}
        </DialogTrigger>
      ) : (
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={`${itemLabel} löschen`} />
          }
        >
          <Trash2 className="size-4 text-destructive" />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wirklich löschen?</DialogTitle>
          <DialogDescription>
            «{itemLabel}» wird endgültig gelöscht. Dieser Schritt kann nicht rückgängig gemacht
            werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Abbrechen</DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await onConfirm();
                setOpen(false);
              })
            }
          >
            {isPending ? "Wird gelöscht…" : "Endgültig löschen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
