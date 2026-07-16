"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { deleteNews, setNewsStatus } from "@/lib/actions/news";
import type { NewsItem } from "@/lib/types";

export function NewsTable({ items }: { items: NewsItem[] }) {
  const [, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Es sind noch keine Neuigkeiten vorhanden.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center gap-4 p-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
            {item.cover_image_url && (
              <Image src={item.cover_image_url} alt="" fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">
              Reihenfolge: {item.order_index}
            </p>
          </div>
          <Select
            defaultValue={item.status}
            onValueChange={(value) =>
              startTransition(() =>
                setNewsStatus(item.id, value as "draft" | "published" | "hidden")
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Entwurf</SelectItem>
              <SelectItem value="published">Veröffentlicht</SelectItem>
              <SelectItem value="hidden">Ausgeblendet</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Bearbeiten"
            nativeButton={false}
            render={<Link href={`/admin/neuigkeiten/${item.id}`} />}
          >
            <Pencil className="size-4" />
          </Button>
          <DeleteConfirmDialog itemLabel={item.title} onConfirm={() => deleteNews(item.id)} />
        </li>
      ))}
    </ul>
  );
}
