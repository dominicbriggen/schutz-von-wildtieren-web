"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-foreground"
      >
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoComplete="name" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="message">Nachricht</Label>
        <Textarea id="message" name="message" required rows={5} className="mt-1.5" />
      </div>
      {/* Honeypot field – hidden from real visitors via CSS, not display:none
          (which some screen readers still announce as focusable). */}
      <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <Label htmlFor="website">Bitte leer lassen</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full shadow-sm sm:w-auto">
        {isPending ? "Wird gesendet…" : "Nachricht senden"}
      </Button>
    </form>
  );
}
