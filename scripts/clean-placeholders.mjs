// One-off: remove public-facing internal placeholders from content blocks.
// - verein.founder_photo_note  -> null (internal note, no photo yet)
// - kontakt.instagram_note      -> null (no valid Instagram link)
// - spenden.placeholder_note    -> neutral factual text (no "[Information…]")
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function patch(key, patchFn) {
  const { data } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", key)
    .single();
  const next = patchFn({ ...data.data });
  const { error } = await supabase.from("content_blocks").update({ data: next }).eq("key", key);
  if (error) throw new Error(`${key}: ${error.message}`);
  console.log(`cleaned ${key}`);
}

await patch("verein", (d) => ({ ...d, founder_photo_note: null }));
await patch("kontakt", (d) => ({ ...d, instagram_note: null }));
await patch("spenden", (d) => ({
  ...d,
  placeholder_note: "Online-Spenden über die Website sind in Vorbereitung.",
}));

console.log("Done. Remaining bracket placeholders in content blocks:");
const { data: all } = await supabase.from("content_blocks").select("key,data");
for (const b of all) {
  const s = JSON.stringify(b.data);
  if (/\[Information/i.test(s)) console.log("  STILL PRESENT in:", b.key);
}
