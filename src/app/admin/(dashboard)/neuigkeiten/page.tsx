import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "@/lib/types";
import { NewsTable } from "./news-table";

export default async function AdminNeuigkeitenPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").order("order_index");

  return (
    <div>
      <AdminPageHeader
        title="Neuigkeiten"
        description="Neuigkeiten erstellen, bearbeiten, veröffentlichen, ausblenden oder löschen."
        action={
          <Link href="/admin/neuigkeiten/neu" className={cn(buttonVariants())}>
            <Plus className="size-4" /> Neue Meldung
          </Link>
        }
      />
      <NewsTable items={(data as NewsItem[]) ?? []} />
    </div>
  );
}
