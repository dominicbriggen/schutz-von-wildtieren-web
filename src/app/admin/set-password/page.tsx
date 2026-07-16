"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

const INVALID_LINK_MESSAGE =
  "Dieser Einladungslink ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.";

export default function SetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Supabase-Einladungs-/Wiederherstellungslinks liefern die Session je nach
    // Flow unterschiedlich aus: als Token im URL-Hash (#access_token=…, impliziter
    // Flow der klassischen E-Mail-Links) oder als ?code=… (PKCE). Der SSR-Client
    // verarbeitet den Hash nicht automatisch, daher lösen wir beide Fälle hier
    // explizit auf und persistieren die Session in Cookies.
    async function establishSession() {
      try {
        const hashParams = window.location.hash.startsWith("#")
          ? new URLSearchParams(window.location.hash.slice(1))
          : null;
        const accessToken = hashParams?.get("access_token");
        const refreshToken = hashParams?.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          // Tokens sofort aus URL/History entfernen (nicht im Verlauf lassen).
          window.history.replaceState(null, "", window.location.pathname);
          if (!setError) return true;
        }

        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState(null, "", window.location.pathname);
          if (!exchangeError) return true;
        }

        // Evtl. besteht bereits eine gültige Session (Seite neu geladen).
        const { data } = await supabase.auth.getSession();
        return Boolean(data.session);
      } catch {
        return false;
      }
    }

    establishSession().then((ok) => {
      if (!ok) setLinkError(INVALID_LINK_MESSAGE);
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== confirm) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError("Das Passwort konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/admin"), 1500);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/60 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="h-14" />
          <h1 className="mt-1 text-xl font-semibold text-foreground">
            Passwort festlegen
          </h1>
          <p className="text-sm text-muted-foreground">
            Schutz von Wildtieren — Verwaltungsbereich
          </p>
        </div>

        {!ready ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Wird geladen…</p>
        ) : linkError ? (
          <div className="mt-8 space-y-4 text-center">
            <p role="alert" className="text-sm font-medium text-destructive">
              {linkError}
            </p>
            <a
              href="/admin/login"
              className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Zur Anmeldung
            </a>
          </div>
        ) : success ? (
          <p role="status" className="mt-8 text-center text-sm text-foreground">
            Passwort gespeichert. Sie werden weitergeleitet…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="password">Neues Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">Mindestens 8 Zeichen.</p>
            </div>
            <div>
              <Label htmlFor="confirm">Passwort bestätigen</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1.5"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Wird gespeichert…" : "Passwort speichern"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
