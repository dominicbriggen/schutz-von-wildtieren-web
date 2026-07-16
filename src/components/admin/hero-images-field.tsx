"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { HeroImage } from "@/lib/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const DIACRITICS_REGEX = new RegExp(
  String.fromCharCode(0x5b, 0x5c, 0x75, 0x30, 0x33, 0x30, 0x30, 0x2d, 0x5c, 0x75, 0x30, 0x33, 0x36, 0x66, 0x5d),
  "g"
);

function slugifyFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const normalized = base.toLowerCase().normalize("NFKD");
  const withoutDiacritics = normalized.replace(DIACRITICS_REGEX, "");
  const slug = withoutDiacritics.replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
  return `${slug || "bild"}${ext.toLowerCase()}`;
}

export function HeroImagesField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: HeroImage[];
}) {
  const [images, setImages] = useState<HeroImage[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Bitte nur JPEG-, PNG-, WebP- oder AVIF-Bilder hochladen.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Die Datei ist zu gross (maximal 8 MB).");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `uploads/${Date.now()}-${slugifyFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: false });
      if (uploadError) {
        setError("Hochladen fehlgeschlagen. Bitte erneut versuchen.");
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("media").insert({ storage_path: path, url: publicUrlData.publicUrl, alt_text: null });
      setImages((prev) => [...prev, { url: publicUrlData.publicUrl, alt: "" }]);
    } finally {
      setUploading(false);
    }
  }

  function updateAlt(index: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <p className="mt-1 text-xs text-muted-foreground">
        Diese Bilder wechseln automatisch als Diashow auf der Startseite.
      </p>

      <div className="mt-3 space-y-3">
        {images.map((image, index) => (
          <div key={image.url} className="flex items-start gap-3 rounded-md border border-border p-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={image.url} alt="" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Input
                value={image.alt}
                onChange={(e) => updateAlt(index, e.target.value)}
                placeholder="Beschreibung (optional, für Barrierefreiheit)"
              />
              {image.credit && (
                <p className="text-xs text-muted-foreground">Bildnachweis: {image.credit}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Bild entfernen"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        {uploading ? "Wird hochgeladen…" : "Bild hinzufügen"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
