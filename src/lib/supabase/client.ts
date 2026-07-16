import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Client Components (login form, admin
// forms with optimistic UI). Uses the public anon key only — all writes
// are still enforced by Row Level Security on the server.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
