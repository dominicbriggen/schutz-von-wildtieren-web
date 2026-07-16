import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getKontakt } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { KontaktForm } from "./kontakt-form";
import { MessagesList } from "./messages-list";

export default async function AdminKontaktPage() {
  const [data, supabase] = await Promise.all([getKontakt(), createClient()]);
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminPageHeader
        title="Kontakt"
        description="Kontaktangaben bearbeiten und eingegangene Nachrichten lesen."
      />

      {data ? (
        <KontaktForm data={data} />
      ) : (
        <p className="text-muted-foreground">Es konnten keine Inhalte geladen werden.</p>
      )}

      <div className="mt-12 max-w-2xl">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Nachrichten aus dem Kontaktformular
        </h2>
        <div className="mt-4">
          <MessagesList messages={messages ?? []} />
        </div>
      </div>
    </div>
  );
}
