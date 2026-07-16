import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/lib/types";
import { GalleryGrid } from "./gallery-grid";
import { GalleryDialog } from "./gallery-dialog";

export default async function AdminBilderPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("year", { ascending: false })
    .order("order_index");

  return (
    <div>
      <AdminPageHeader
        title="Bilder"
        description="Bilder hochladen und der Bildergalerie zuordnen."
        action={<GalleryDialog triggerLabel="Bild hinzufügen" />}
      />
      <GalleryGrid images={(data as GalleryImage[]) ?? []} />
    </div>
  );
}
