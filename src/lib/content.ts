import { createClient } from "@/lib/supabase/server";
import type {
  ErfolgeIntroData,
  FooterData,
  GalleryImage,
  HomeHeroData,
  KontaktData,
  NewsItem,
  Project,
  SpendenData,
  SuccessEntry,
  VereinData,
} from "@/lib/types";

async function getBlock<T>(key: string): Promise<T | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", key)
    .maybeSingle();
  return (data?.data as T) ?? null;
}

export const getHomeHero = () => getBlock<HomeHeroData>("home_hero");
export const getVerein = () => getBlock<VereinData>("verein");
export const getKontakt = () => getBlock<KontaktData>("kontakt");
export const getSpenden = () => getBlock<SpendenData>("spenden");
export const getErfolgeIntro = () => getBlock<ErfolgeIntroData>("erfolge_intro");
export const getFooter = () => getBlock<FooterData>("footer");

export async function getProjects(opts?: { onlyPublished?: boolean }) {
  const supabase = await createClient();
  let query = supabase.from("projects").select("*").order("order_index");
  if (opts?.onlyPublished !== false) query = query.eq("status", "published");
  const { data } = await query;
  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string) {
  // No explicit status filter here: RLS already restricts anonymous
  // visitors to published rows, while a signed-in admin can also load
  // drafts/hidden projects by slug — which is what powers the "Vorschau"
  // link in the admin dashboard.
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as Project | null;
}

export async function getNews(opts?: { onlyPublished?: boolean }) {
  const supabase = await createClient();
  let query = supabase
    .from("news")
    .select("*")
    .order("order_index")
    .order("created_at", { ascending: false });
  if (opts?.onlyPublished !== false) query = query.eq("status", "published");
  const { data } = await query;
  return (data ?? []) as NewsItem[];
}

export async function getNewsBySlug(slug: string) {
  // See getProjectBySlug: no explicit status filter, RLS handles it.
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as NewsItem | null;
}

export async function getSuccessEntries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("success_entries")
    .select("*")
    .eq("status", "published")
    .order("project_slug")
    .order("order_index");
  return (data ?? []) as SuccessEntry[];
}

export async function getGalleryImages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false })
    .order("order_index");
  return (data ?? []) as GalleryImage[];
}
