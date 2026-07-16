"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { deleteGalleryImage, toggleGalleryVisibility } from "@/lib/actions/gallery";
import type { GalleryImage } from "@/lib/types";
import { GalleryDialog } from "./gallery-dialog";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [, startTransition] = useTransition();

  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">Es sind noch keine Bilder vorhanden.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div key={image.id} className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="relative aspect-square w-full bg-muted">
            <Image src={image.url} alt={image.alt_text ?? ""} fill className="object-cover" />
          </div>
          <div className="space-y-2 p-3">
            <p className="truncate text-sm font-medium text-foreground">
              {image.category ?? "Ohne Kategorie"}
            </p>
            <p className="text-xs text-muted-foreground">{image.year ?? "Ohne Jahr"}</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  defaultChecked={image.status !== "hidden"}
                  onCheckedChange={(checked) =>
                    startTransition(() => toggleGalleryVisibility(image.id, !checked))
                  }
                  aria-label="Sichtbar"
                />
                <span className="text-xs text-muted-foreground">Sichtbar</span>
              </div>
              <div className="flex gap-1">
                <GalleryDialog image={image} triggerLabel="Bearbeiten" />
                <DeleteConfirmDialog
                  itemLabel={image.category ?? "Bild"}
                  onConfirm={() => deleteGalleryImage(image.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
