"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveButton } from "@/components/admin/save-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { FormState } from "@/lib/actions/news";
import type { NewsItem } from "@/lib/types";

export function NewsForm({
  item,
  action,
}: {
  item?: NewsItem;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as FormState);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message ?? "Fehler beim Speichern.");
  }, [state]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" defaultValue={item?.title} className="mt-1.5" required />
      </div>

      <div>
        <Label htmlFor="slug">Link-Name (in der Webadresse)</Label>
        <Input id="slug" name="slug" defaultValue={item?.slug} className="mt-1.5" required />
        <p className="mt-1 text-xs text-muted-foreground">
          Nur Kleinbuchstaben, Zahlen und Bindestriche.
        </p>
      </div>

      <div>
        <Label htmlFor="summary">Kurze Zusammenfassung</Label>
        <Textarea
          id="summary"
          name="summary"
          defaultValue={item?.summary ?? ""}
          rows={2}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="body">Text</Label>
        <Textarea
          id="body"
          name="body"
          defaultValue={item?.body ?? ""}
          rows={10}
          className="mt-1.5"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Absätze mit einer Leerzeile trennen.
        </p>
      </div>

      <ImageUploadField
        name="cover_image_url"
        label="Titelbild"
        defaultValue={item?.cover_image_url}
      />

      <div>
        <Label htmlFor="date_label">Datum (frei, z. B. „2025“ oder leer lassen)</Label>
        <Input
          id="date_label"
          name="date_label"
          defaultValue={item?.date_label ?? ""}
          className="mt-1.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={item?.status ?? "draft"}>
            <SelectTrigger id="status" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Entwurf</SelectItem>
              <SelectItem value="published">Veröffentlicht</SelectItem>
              <SelectItem value="hidden">Ausgeblendet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="order_index">Reihenfolge (kleiner = weiter oben)</Label>
          <Input
            id="order_index"
            name="order_index"
            type="number"
            defaultValue={item?.order_index ?? 0}
            className="mt-1.5"
          />
        </div>
      </div>

      <SaveButton label={item ? "Speichern" : "Neuigkeit erstellen"} />
    </form>
  );
}
