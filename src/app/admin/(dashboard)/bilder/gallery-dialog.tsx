"use client";

import { useState, useTransition } from "react";
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
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createGalleryImage, updateGalleryImage } from "@/lib/actions/gallery";
import type { GalleryImage } from "@/lib/types";

export function GalleryDialog({
  image,
  triggerLabel,
}: {
  image?: GalleryImage;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = image
        ? await updateGalleryImage(image.id, formData)
        : await createGalleryImage(formData);
      if (result.status === "error") {
        toast.error(result.message ?? "Fehler beim Speichern.");
        return;
      }
      toast.success("Bild gespeichert.");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={image ? "outline" : "default"} size={image ? "sm" : "default"} />}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{image ? "Bild bearbeiten" : "Neues Bild"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <ImageUploadField name="url" label="Bild" defaultValue={image?.url} />
          <div>
            <Label htmlFor="alt_text">Bildbeschreibung (Alt-Text)</Label>
            <Input
              id="alt_text"
              name="alt_text"
              defaultValue={image?.alt_text ?? ""}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Input
              id="category"
              name="category"
              defaultValue={image?.category ?? ""}
              placeholder="z. B. Wildsalzquellen"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="year">Jahr</Label>
            <Input
              id="year"
              name="year"
              defaultValue={image?.year ?? ""}
              placeholder="z. B. 2026"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="order_index">Reihenfolge</Label>
            <Input
              id="order_index"
              name="order_index"
              type="number"
              defaultValue={image?.order_index ?? 0}
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
