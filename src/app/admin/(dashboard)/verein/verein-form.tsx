"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/admin/save-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { updateVerein, type FormState } from "@/lib/actions/content-blocks";
import type { TeamMember, VereinData } from "@/lib/types";

const initialState: FormState = { status: "idle" };

export function VereinForm({ data }: { data: VereinData }) {
  const [state, formAction] = useActionState(updateVerein, initialState);
  const [helpers, setHelpers] = useState<TeamMember[]>(data.helpers);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message ?? "Fehler beim Speichern.");
  }, [state]);

  function updateHelper(index: number, patch: Partial<TeamMember>) {
    setHelpers((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-10">
      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Vereinspräsident / Gründer
        </h2>
        <div>
          <Label htmlFor="founder_name">Name</Label>
          <Input id="founder_name" name="founder_name" defaultValue={data.founder_name} className="mt-1.5" required />
        </div>
        <div>
          <Label htmlFor="founder_role">Rolle</Label>
          <Input id="founder_role" name="founder_role" defaultValue={data.founder_role} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="founder_bio">Beschreibung</Label>
          <Textarea
            id="founder_bio"
            name="founder_bio"
            defaultValue={data.founder_bio}
            rows={10}
            className="mt-1.5"
          />
        </div>
        <ImageUploadField
          name="founder_photo_url"
          label="Foto"
          defaultValue={data.founder_photo_url}
        />
        <div>
          <Label htmlFor="founder_photo_note">Hinweis, falls kein Foto vorhanden</Label>
          <Input
            id="founder_photo_note"
            name="founder_photo_note"
            defaultValue={data.founder_photo_note ?? ""}
            className="mt-1.5"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Team</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setHelpers((prev) => [...prev, { name: "", role: "", bio: "", photo_url: null }])
            }
          >
            <Plus className="size-4" /> Person hinzufügen
          </Button>
        </div>

        {helpers.map((helper, index) => (
          <div key={index} className="space-y-4 rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Person {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setHelpers((prev) => prev.filter((_, i) => i !== index))}
                aria-label="Person entfernen"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={helper.name}
                onChange={(e) => updateHelper(index, { name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Rolle</Label>
              <Input
                value={helper.role}
                onChange={(e) => updateHelper(index, { role: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Beschreibung</Label>
              <Textarea
                value={helper.bio}
                onChange={(e) => updateHelper(index, { bio: e.target.value })}
                rows={4}
                className="mt-1.5"
              />
            </div>
            <ImageUploadField
              label="Foto"
              defaultValue={helper.photo_url}
              onChange={(url) => updateHelper(index, { photo_url: url })}
            />
          </div>
        ))}
        <input type="hidden" name="helpers" value={JSON.stringify(helpers)} />
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Unsere Ziele</h2>
        <div>
          <Label htmlFor="goals_title">Titel</Label>
          <Input id="goals_title" name="goals_title" defaultValue={data.goals_title} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="goals_text">Text</Label>
          <Textarea
            id="goals_text"
            name="goals_text"
            defaultValue={data.goals_text}
            rows={6}
            className="mt-1.5"
          />
        </div>
      </section>

      <SaveButton />
    </form>
  );
}
