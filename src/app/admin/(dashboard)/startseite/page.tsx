import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getHomeHero } from "@/lib/content";
import { HomeHeroForm } from "./home-hero-form";

export default async function AdminStartseitePage() {
  const data = await getHomeHero();

  if (!data) {
    return (
      <div>
        <AdminPageHeader title="Startseite" />
        <p className="text-muted-foreground">
          Es konnten keine Inhalte geladen werden.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Startseite"
        description="Hauptaussage, Vereinstext und Startbild bearbeiten."
      />
      <HomeHeroForm data={data} />
    </div>
  );
}
