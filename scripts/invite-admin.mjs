import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2];
const redirectTo = process.argv[3];

if (!email || !redirectTo) {
  console.error("Usage: node scripts/invite-admin.mjs <email> <redirectTo>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("invite failed:", error.message);
    process.exit(1);
  }

  const userId = data.user.id;
  await new Promise((r) => setTimeout(r, 500));

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ is_admin: true })
    .eq("id", userId);

  if (updateError) {
    console.error("profiles update failed:", updateError.message);
    process.exit(1);
  }

  console.log("Invited admin:", email, userId);
}

run();
