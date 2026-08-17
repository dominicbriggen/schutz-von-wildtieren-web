"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X, FileWarning, ImageIcon } from "lucide-react";
import {
  uploadFormImage,
  validateImage,
  type UploadedImage,
} from "@/lib/forms/upload";
import { MAX_IMAGES } from "@/lib/forms/constants";
import { cn } from "@/lib/utils";

type Item = {
  id: number;
  name: string;
  size: number;
  previewUrl: string;
  canPreview: boolean;
  status: "uploading" | "done" | "error";
  error?: string;
  uploaded?: UploadedImage;
};

export function ImageUploader({
  folder,
  name = "images",
  hint,
}: {
  folder: "wildseek" | "fence";
  name?: string;
  hint?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const doneCount = items.filter((i) => i.status !== "error").length;

  function setItem(id: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_IMAGES - doneCount;
    const chosen = Array.from(files).slice(0, Math.max(0, remaining));

    for (const file of chosen) {
      const id = nextId.current++;
      const validationError = validateImage(file);
      const canPreview = /^image\/(jpeg|png|webp)$/.test(file.type);
      const previewUrl = canPreview ? URL.createObjectURL(file) : "";

      setItems((prev) => [
        ...prev,
        {
          id,
          name: file.name,
          size: file.size,
          previewUrl,
          canPreview,
          status: validationError ? "error" : "uploading",
          error: validationError ?? undefined,
        },
      ]);

      if (validationError) continue;

      try {
        const uploaded = await uploadFormImage(folder, file);
        setItem(id, { status: "done", uploaded });
      } catch {
        setItem(id, {
          status: "error",
          error: "Hochladen fehlgeschlagen. Bitte erneut versuchen.",
        });
      }
    }
  }

  function remove(id: number) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  const uploaded = items
    .filter((i) => i.status === "done" && i.uploaded)
    .map((i) => i.uploaded as UploadedImage);

  const canAddMore = doneCount < MAX_IMAGES;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.id}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg border bg-muted",
              it.status === "error" ? "border-destructive/40" : "border-border"
            )}
          >
            {it.canPreview && it.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.previewUrl}
                alt={it.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center text-muted-foreground">
                {it.status === "error" ? (
                  <FileWarning className="size-6 text-destructive" />
                ) : (
                  <ImageIcon className="size-6" />
                )}
                <span className="line-clamp-2 text-[0.65rem] leading-tight break-all">
                  {it.name}
                </span>
              </div>
            )}

            {it.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            )}

            {it.status === "error" && it.error && (
              <div className="absolute inset-x-0 bottom-0 bg-destructive/90 px-1 py-0.5 text-center text-[0.6rem] leading-tight text-white">
                {it.error}
              </div>
            )}

            <button
              type="button"
              onClick={() => remove(it.id)}
              aria-label={`${it.name} entfernen`}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-input text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ImagePlus className="size-6" aria-hidden="true" />
            <span className="text-xs font-medium">Bild wählen</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        multiple
        capture={undefined}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-muted-foreground">
        {hint ??
          `Bis zu ${MAX_IMAGES} Bilder (JPEG, PNG, WebP, HEIC), max. 10 MB pro Bild.`}{" "}
        {doneCount > 0 && `${doneCount}/${MAX_IMAGES} ausgewählt.`}
      </p>

      {/* Uploaded object references submitted with the form. */}
      <input type="hidden" name={name} value={JSON.stringify(uploaded)} />
    </div>
  );
}
