import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getSpenden } from "@/lib/content";
import { SpendenForm } from "./spenden-form";

export default async function AdminSpendenPage() {
  const data = await getSpenden();

  if (!data) {
    return (
      <div>
        <AdminPageHeader title="Spenden" />
        <p className="text-muted-foreground">Es konnten keine Inhalte geladen werden.</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Spenden" description="Spendentext und Beträge bearbeiten." />
      <SpendenForm data={data} />
    </div>
  );
}
