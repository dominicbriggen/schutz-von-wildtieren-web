import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { updateProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";
import { ProjectForm } from "../project-form";

export default async function EditProjektPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  const project = data as Project;
  const action = updateProject.bind(null, id);

  return (
    <div>
      <AdminPageHeader
        title={`Projekt bearbeiten: ${project.title}`}
        action={
          <Link
            href={`/projekte/${project.slug}`}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Eye className="size-4" /> Vorschau
          </Link>
        }
      />
      <ProjectForm project={project} action={action} />
    </div>
  );
}
