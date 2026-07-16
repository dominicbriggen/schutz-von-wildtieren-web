import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createNews } from "@/lib/actions/news";
import { NewsForm } from "../news-form";

export default function NeueNeuigkeitPage() {
  return (
    <div>
      <AdminPageHeader title="Neue Neuigkeit" />
      <NewsForm action={createNews} />
    </div>
  );
}
