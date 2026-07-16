import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createProject } from "@/lib/actions/projects";
import { ProjectForm } from "../project-form";

export default function NeuesProjektPage() {
  return (
    <div>
      <AdminPageHeader title="Neues Projekt" />
      <ProjectForm action={createProject} />
    </div>
  );
}
