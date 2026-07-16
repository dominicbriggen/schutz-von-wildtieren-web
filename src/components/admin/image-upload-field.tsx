"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const DIACRITICS_REGEX = new RegExp(String.fromCharCode(0x5b, 0x5c, 0x75, 0x30, 0x33, 0x30, 0x30, 0x2d, 0x5c, 0x75, 0x30, 0x33, 0x36, 0x66, 0x5d), "g");

function slugifyFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const normalized = base.toLowerCase().normalize("NFKD");
  const withoutDiacritics = normalized.replace(DIACRITICS_REGEX, "");
  const slug = withoutDiacritics.replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
  return `${slug || "bild"}${ext.toLowerCase()}`;
}

export function ImageUploadField({
  name,
  label,
  defaultValue,
  onChange,
}: {
  name?: string;
  label: string;
  defaultValue?: string | null;
  onChange?: (url: string | null) => void;
}) {
  const [url, setUrl] = useState<string | null>(defaultValue ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange?.(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

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

      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(path);

      await supabase.from("media").insert({
        storage_path: path,
        url: publicUrlData.publicUrl,
        alt_text: null,
      });

      setUrl(publicUrlData.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      {name && <input type="hidden" name={name} value={url ?? ""} />}
      <div className="mt-1.5 flex items-start gap-4">
        {url ? (
          <div className="relative size-28 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setUrl(null)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label="Bild entfernen"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex size-28 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
            <ImagePlus className="size-6" aria-hidden="true" />
          </div>
        )}

        <div className="flex flex-col gap-2">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Wird hochgeladen…
              </>
            ) : url ? (
              "Bild ersetzen"
            ) : (
              "Bild hochladen"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP oder AVIF, maximal 8 MB.
          </p>
          {error && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
