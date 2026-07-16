"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

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

export function ImageListField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
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

      await supabase.from("media").insert({
        storage_path: path,
        url: publicUrlData.publicUrl,
        alt_text: null,
      });

      setUrls((prev) => [...prev, publicUrlData.publicUrl]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="mt-1.5 flex flex-wrap gap-3">
        {urls.map((url, index) => (
          <div
            key={url}
            className="relative size-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
          >
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Bild entfernen"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="size-5" aria-hidden="true" />
              <span className="text-xs">Hinzufügen</span>
            </>
          )}
        </button>
      </div>
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
      <p className="mt-2 text-xs text-muted-foreground">
        JPEG, PNG, WebP oder AVIF, maximal 8 MB pro Bild.
      </p>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
