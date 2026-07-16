"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SaveButton({ label = "Speichern" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Wird gespeichert…" : label}
    </Button>
  );
}
