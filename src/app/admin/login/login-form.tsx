"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { login, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const notAdmin = searchParams.get("error") === "not_admin";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo className="h-14" />
        <h1 className="mt-1 text-xl font-semibold text-foreground">
          Verwaltungsbereich
        </h1>
        <p className="text-sm text-muted-foreground">Schutz von Wildtieren</p>
      </div>

      <form action={formAction} className="mt-8 space-y-5">
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
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5"
          />
        </div>

        {(state.status === "error" || notAdmin) && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {state.message ?? "Dieses Konto hat keinen Zugriff auf den Verwaltungsbereich."}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Wird angemeldet…" : "Anmelden"}
        </Button>
      </form>
    </div>
  );
}
