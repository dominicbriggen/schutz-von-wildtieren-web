import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server-side guard for the admin dashboard. Verifies there is an authenticated
// user whose profile is flagged is_admin; otherwise redirects to the login
// page. Returns the Supabase client so callers can reuse it. RLS remains the
// ultimate data guard — this is defence in depth plus a clean redirect.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/admin/login");

  return { user, supabase };
}
