"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveButton } from "@/components/admin/save-button";
import { updateKontakt, type FormState } from "@/lib/actions/content-blocks";
import type { KontaktData } from "@/lib/types";

const initialState: FormState = { status: "idle" };

export function KontaktForm({ data }: { data: KontaktData }) {
  const [state, formAction] = useActionState(updateKontakt, initialState);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message ?? "Fehler beim Speichern.");
  }, [state]);

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      <div>
        <Label htmlFor="name">Vereinsname</Label>
        <Input id="name" name="name" defaultValue={data.name} className="mt-1.5" required />
      </div>
      <div>
        <Label htmlFor="strasse">Strasse und Nummer</Label>
        <Input id="strasse" name="strasse" defaultValue={data.strasse} className="mt-1.5" required />
      </div>
      <div>
        <Label htmlFor="ort">PLZ und Ort</Label>
        <Input id="ort" name="ort" defaultValue={data.ort} className="mt-1.5" required />
      </div>
      <div>
        <Label htmlFor="telefon">Telefon</Label>
        <Input id="telefon" name="telefon" defaultValue={data.telefon ?? ""} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" name="email" type="email" defaultValue={data.email} className="mt-1.5" required />
      </div>
      <div>
        <Label htmlFor="instagram_url">Instagram-Link (leer lassen, falls keiner vorhanden)</Label>
        <Input
          id="instagram_url"
          name="instagram_url"
          defaultValue={data.instagram_url ?? ""}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="instagram_note">Hinweis, falls kein Instagram-Link vorhanden</Label>
        <Input
          id="instagram_note"
          name="instagram_note"
          defaultValue={data.instagram_note ?? ""}
          className="mt-1.5"
        />
      </div>
      <SaveButton />
    </form>
  );
}
