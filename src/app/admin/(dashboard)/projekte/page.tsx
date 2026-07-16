import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { ProjectsTable } from "./projects-table";

export default async function AdminProjektePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("order_index");

  return (
    <div>
      <AdminPageHeader
        title="Projekte"
        description="Projekte erstellen, bearbeiten, veröffentlichen, ausblenden oder löschen."
        action={
          <Link href="/admin/projekte/neu" className={cn(buttonVariants())}>
            <Plus className="size-4" /> Neues Projekt
          </Link>
        }
      />
      <ProjectsTable projects={(data as Project[]) ?? []} />
    </div>
  );
}
