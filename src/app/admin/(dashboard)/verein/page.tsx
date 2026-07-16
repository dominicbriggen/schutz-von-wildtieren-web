import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getVerein } from "@/lib/content";
import { VereinForm } from "./verein-form";

export default async function AdminVereinPage() {
  const data = await getVerein();

  if (!data) {
    return (
      <div>
        <AdminPageHeader title="Verein" />
        <p className="text-muted-foreground">Es konnten keine Inhalte geladen werden.</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Verein"
        description="Vereinspräsident, Team und Ziele bearbeiten."
      />
      <VereinForm data={data} />
    </div>
  );
}
