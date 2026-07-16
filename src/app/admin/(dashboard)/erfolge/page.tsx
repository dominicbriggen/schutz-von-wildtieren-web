import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import type { SuccessEntry } from "@/lib/types";
import { EntriesList } from "./entries-list";
import { EntryDialog } from "./entry-dialog";

export default async function AdminErfolgePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("success_entries")
    .select("*")
    .order("title")
    .order("order_index");

  return (
    <div>
      <AdminPageHeader
        title="Erfolge"
        description="Ergebnisse je Projekt pflegen."
        action={<EntryDialog triggerLabel="Neuer Erfolg" />}
      />
      <EntriesList entries={(data as SuccessEntry[]) ?? []} />
    </div>
  );
}
