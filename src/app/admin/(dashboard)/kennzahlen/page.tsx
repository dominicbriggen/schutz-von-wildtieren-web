import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getProjectStats, getProjects } from "@/lib/content";
import { KennzahlenForm } from "./kennzahlen-form";

export default async function AdminKennzahlenPage() {
  const [stats, projects] = await Promise.all([
    getProjectStats(),
    getProjects({ onlyPublished: false }),
  ]);

  const titles: Record<string, string> = Object.fromEntries(
    projects.map((p) => [p.slug, p.title])
  );

  if (!stats || stats.entries.length === 0) {
    return (
      <div>
        <AdminPageHeader title="Kennzahlen" />
        <p className="text-muted-foreground">
          Es sind noch keine Kennzahlen hinterlegt.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Kennzahlen"
        description="Zentrale Projekt-Kennzahlen (Systeme, Meter, Inseln) und Projektstatus. Werden automatisch auf mehreren Seiten verwendet."
      />
      <KennzahlenForm entries={stats.entries} titles={titles} />
    </div>
  );
}
