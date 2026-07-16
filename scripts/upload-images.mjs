import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const dir = process.argv[2];
const prefix = process.argv[3] || "originals";

async function upload(file) {
  const filePath = path.join(dir, file);
  const data = fs.readFileSync(filePath);
  const objectPath = `${prefix}/${file}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/media/${encodeURIComponent(objectPath)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        apikey: SERVICE_ROLE_KEY,
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
      },
      body: data,
    }
  );
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/media/${objectPath}`;
  if (!res.ok) {
    const text = await res.text();
    console.error(`FAIL ${file}: ${res.status} ${text}`);
    return null;
  }
  console.log(`OK ${file} -> ${publicUrl}`);
  return publicUrl;
}

async function run() {
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const results = {};
  for (const f of files) {
    results[f] = await upload(f);
  }
  fs.writeFileSync(
    path.join(dir, "upload-manifest.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("DONE", files.length);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
