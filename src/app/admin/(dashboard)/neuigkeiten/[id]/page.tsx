import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { updateNews } from "@/lib/actions/news";
import type { NewsItem } from "@/lib/types";
import { NewsForm } from "../news-form";

export default async function EditNeuigkeitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  const item = data as NewsItem;
  const action = updateNews.bind(null, id);

  return (
    <div>
      <AdminPageHeader
        title={`Neuigkeit bearbeiten: ${item.title}`}
        action={
          <Link
            href={`/aktuelles/${item.slug}`}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Eye className="size-4" /> Vorschau
          </Link>
        }
      />
      <NewsForm item={item} action={action} />
    </div>
  );
}
