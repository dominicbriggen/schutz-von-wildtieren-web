import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-free Supabase client for build-time static generation
// (generateStaticParams / generateMetadata run outside a request context,
// so next/headers' cookies() is unavailable there). Only used for public,
// already-RLS-restricted reads of published slugs.
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
