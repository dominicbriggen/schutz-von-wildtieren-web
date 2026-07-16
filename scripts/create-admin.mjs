import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    console.error("createUser failed:", createError.message);
    process.exit(1);
  }

  const userId = userData.user.id;

  // The handle_new_user trigger creates the profiles row automatically;
  // wait briefly then flip is_admin.
  await new Promise((r) => setTimeout(r, 500));

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ is_admin: true })
    .eq("id", userId);

  if (updateError) {
    console.error("profiles update failed:", updateError.message);
    process.exit(1);
  }

  console.log("Admin user created:", email, userId);
}

run();
