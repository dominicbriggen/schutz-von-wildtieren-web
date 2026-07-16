import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@/lib/types";

const LABELS: Record<ContentStatus, string> = {
  draft: "Entwurf",
  published: "Veröffentlicht",
  hidden: "Ausgeblendet",
};

const VARIANT: Record<ContentStatus, "default" | "secondary" | "outline"> = {
  draft: "outline",
  published: "default",
  hidden: "secondary",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return <Badge variant={VARIANT[status]}>{LABELS[status]}</Badge>;
}
