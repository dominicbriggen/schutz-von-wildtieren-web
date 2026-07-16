"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markMessageRead(id: string) {
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/kontakt");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/kontakt");
}
