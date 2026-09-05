"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

// Neutral confirmation shown in every case (success, unknown address, or
// error) so the page never reveals whether an account exists.
const NEUTRAL =
  "Falls für diese Adresse ein Konto besteht, haben wir eine E-Mail mit einem Link zum Zurücksetzen des Passworts gesendet. Bitte prüfen Sie Ihr Postfach.";

export default function PasswortVergessenPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    try {
      const supabase = createClient();
      // The recovery link returns the visitor to the existing set-password
      // page, which consumes the token and lets them choose a new password.
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/set-password`,
      });
    } catch {
      // Deliberately ignored — we always show the same neutral message.
    } finally {
      setSubmitting(false);
      setDone(true);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/60 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="h-14" />
          <h1 className="mt-1 text-xl font-semibold text-foreground">
            Passwort zurücksetzen
          </h1>
          <p className="text-sm text-muted-foreground">
            Schutz von Wildtieren — Verwaltungsbereich
          </p>
        </div>

        {done ? (
          <div className="mt-8 space-y-5 text-center">
            <p role="status" className="text-sm text-foreground">
              {NEUTRAL}
            </p>
            <Link
              href="/admin/login"
              className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Zur Anmeldung
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <p className="text-sm text-muted-foreground">
              Geben Sie die E-Mail-Adresse Ihres Verwaltungskontos an. Wir senden
              Ihnen einen Link, mit dem Sie ein neues Passwort festlegen können.
            </p>
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
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Wird gesendet…" : "Link zum Zurücksetzen senden"}
            </Button>
            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Zurück zur Anmeldung
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
