"use client";

import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export function DeleteAndBack({
  itemLabel,
  backHref,
  action,
}: {
  itemLabel: string;
  backHref: string;
  action: () => Promise<void>;
}) {
  const router = useRouter();
  return (
    <DeleteConfirmDialog
      itemLabel={itemLabel}
      triggerLabel="Löschen"
      onConfirm={async () => {
        await action();
        router.push(backHref);
        router.refresh();
      }}
    />
  );
}
