"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SaveButton } from "@/components/admin/save-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { updateSpenden, type FormState } from "@/lib/actions/content-blocks";
import type { SpendenData } from "@/lib/types";

const initialState: FormState = { status: "idle" };

export function SpendenForm({ data }: { data: SpendenData }) {
  const [state, formAction] = useActionState(updateSpenden, initialState);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message ?? "Fehler beim Speichern.");
  }, [state]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" defaultValue={data.title} className="mt-1.5" required />
      </div>
      <div>
        <Label htmlFor="text">Text</Label>
        <Textarea id="text" name="text" defaultValue={data.text} rows={6} className="mt-1.5" />
        <p className="mt-1 text-xs text-muted-foreground">
          Absätze mit einer Leerzeile trennen.
        </p>
      </div>
      <div>
        <Label htmlFor="amounts">Vorgeschlagene Beträge (CHF, durch Komma getrennt)</Label>
        <Input
          id="amounts"
          name="amounts"
          defaultValue={data.amounts.join(", ")}
          className="mt-1.5"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="online_payment_ready" name="online_payment_ready" defaultChecked={data.online_payment_ready} />
        <Label htmlFor="online_payment_ready">Online-Spenden sind bereits aktiv</Label>
      </div>
      <div>
        <Label htmlFor="placeholder_note">Hinweistext, solange Online-Spenden nicht aktiv sind</Label>
        <Textarea
          id="placeholder_note"
          name="placeholder_note"
          defaultValue={data.placeholder_note}
          rows={3}
          className="mt-1.5"
        />
      </div>
      <ImageUploadField name="hero_image_url" label="Bild" defaultValue={data.hero_image_url} />
      <SaveButton />
    </form>
  );
}
