// One-off: seed/refresh the central `project_stats` content block.
// Single source of truth for the headline project metrics + status.
// Values confirmed by the association (Juli 2026 figures).
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

const data = {
  entries: [
    {
      slug: "wildtierschonender-weidezaun",
      is_main: true,
      status: "aktiv",
      metric_value: "18'000",
      metric_unit: "Meter",
      metric_label: "finanzierte Laufmeter",
      as_of: "Juli 2026",
    },
    {
      slug: "wildseek",
      is_main: true,
      status: "aktiv",
      metric_value: "117",
      metric_unit: "Systeme",
      metric_label: "finanzierte Systeme",
      as_of: "Juli 2026",
    },
    {
      slug: "biodiversitaetsinseln",
      is_main: true,
      status: "aktiv",
      metric_value: "20",
      metric_unit: "Inseln",
      metric_label: "realisierte Biodiversitätsinseln",
      notes: [
        "Weitere Inseln sind bereits finanziert.",
        "Weitere Standorte befinden sich in Planung bzw. Konzeption.",
      ],
    },
    {
      slug: "wildsalzquellen",
      is_main: false,
      status: "pausiert",
      status_label: "Projektpause seit Dezember 2025",
    },
    {
      slug: "biberdamm-ueberwachung",
      is_main: false,
      status: "aktiv",
    },
  ],
};

const { error } = await supabase
  .from("content_blocks")
  .upsert({ key: "project_stats", data }, { onConflict: "key" });

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}
console.log("project_stats seeded:", data.entries.map((e) => `${e.slug}=${e.metric_value ?? e.status}`).join(", "));
