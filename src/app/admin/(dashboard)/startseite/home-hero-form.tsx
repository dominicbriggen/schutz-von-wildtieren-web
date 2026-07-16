"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/admin/save-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { updateHomeHero, type FormState } from "@/lib/actions/content-blocks";
import type { HomeHeroData } from "@/lib/types";

const initialState: FormState = { status: "idle" };

export function HomeHeroForm({ data }: { data: HomeHeroData }) {
  const [state, formAction] = useActionState(updateHomeHero, initialState);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message ?? "Fehler beim Speichern.");
  }, [state]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="headline">Hauptaussage</Label>
        <Input id="headline" name="headline" defaultValue={data.headline} className="mt-1.5" required />
      </div>

      <div>
        <Label htmlFor="intro_title">Titel der Vereinsvorstellung</Label>
        <Input id="intro_title" name="intro_title" defaultValue={data.intro_title} className="mt-1.5" required />
      </div>

      <div>
        <Label htmlFor="intro_text">Kurze Vereinsvorstellung</Label>
        <Textarea
          id="intro_text"
          name="intro_text"
          defaultValue={data.intro_text}
          rows={6}
          className="mt-1.5"
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Absätze mit einer Leerzeile trennen.
        </p>
      </div>

      <div>
        <Label htmlFor="quote">Zitat</Label>
        <Textarea id="quote" name="quote" defaultValue={data.quote} rows={2} className="mt-1.5" />
      </div>

      <ImageUploadField name="hero_image_url" label="Startbild" defaultValue={data.hero_image_url} />

      <SaveButton />
    </form>
  );
}
