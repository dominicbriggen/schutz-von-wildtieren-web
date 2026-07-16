"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/admin/save-button";
import { HeroImagesField } from "@/components/admin/hero-images-field";
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
        <Label htmlFor="subline">Unterzeile</Label>
        <Textarea id="subline" name="subline" defaultValue={data.subline} rows={2} className="mt-1.5" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primary_cta_label">Haupt-Button: Beschriftung</Label>
          <Input
            id="primary_cta_label"
            name="primary_cta_label"
            defaultValue={data.primary_cta_label}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <Label htmlFor="primary_cta_href">Haupt-Button: Ziel-Seite</Label>
          <Input
            id="primary_cta_href"
            name="primary_cta_href"
            defaultValue={data.primary_cta_href}
            className="mt-1.5"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="secondary_cta_label">Zweiter Button: Beschriftung</Label>
          <Input
            id="secondary_cta_label"
            name="secondary_cta_label"
            defaultValue={data.secondary_cta_label}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <Label htmlFor="secondary_cta_href">Zweiter Button: Ziel-Seite</Label>
          <Input
            id="secondary_cta_href"
            name="secondary_cta_href"
            defaultValue={data.secondary_cta_href}
            className="mt-1.5"
            required
          />
        </div>
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

      <HeroImagesField name="hero_images" label="Startbilder (Diashow)" defaultValue={data.hero_images} />

      <SaveButton />
    </form>
  );
}
