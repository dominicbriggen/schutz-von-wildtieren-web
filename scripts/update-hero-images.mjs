// One-off admin script: repoint the home_hero content block to the new
// redesigned hero images (Reh, Igel, Wildbiene) with fresh filenames,
// accurate German alt text, Pexels credits, and a per-image focal
// `position` used by the hero slider for mobile-friendly cropping.
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const base = `${SUPABASE_URL}/storage/v1/object/public/media/hero`;

const heroImages = [
  {
    url: `${base}/hero-reh-wiese.jpg`,
    alt: "Reh mit Kitz auf einer blühenden Sommerwiese",
    credit: "Foto: Maria Argiroudaki / Pexels",
    position: "50% 50%",
  },
  {
    url: `${base}/hero-igel-blume.jpg`,
    alt: "Igel schnuppert im Abendlicht an einer weissen Blüte",
    credit: "Foto: Nikola Tomašić / Pexels",
    position: "42% 50%",
  },
  {
    url: `${base}/hero-wildbiene-distel.jpg`,
    alt: "Hummel sammelt Nektar auf einer violetten Distelblüte",
    credit: "Foto: Michelle Reeves / Pexels",
    position: "50% 32%",
  },
];

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await supabase
  .from("content_blocks")
  .select("data")
  .eq("key", "home_hero")
  .single();

if (error) {
  console.error("Fetch failed:", error.message);
  process.exit(1);
}

const next = { ...data.data, hero_images: heroImages };

const { error: upErr } = await supabase
  .from("content_blocks")
  .update({ data: next })
  .eq("key", "home_hero");

if (upErr) {
  console.error("Update failed:", upErr.message);
  process.exit(1);
}

console.log("home_hero updated with", heroImages.length, "new hero images:");
for (const img of heroImages) console.log(" -", img.url, `(${img.position})`);
