import { cn } from "@/lib/utils";
import type { ProjectStat } from "@/lib/types";

/** Einheitliche Kennzeichnung des Projektstatus. Aktive Hauptprojekte werden
 *  hervorgehoben, pausierte/frühere Projekte dezent gekennzeichnet. */
export function ProjectStatusBadge({
  stat,
  className,
}: {
  stat: ProjectStat | null | undefined;
  className?: string;
}) {
  if (!stat) return null;

  let label: string | null = null;
  let tone = "";

  if (stat.status === "pausiert") {
    label = stat.status_label ?? "Pausiert";
    tone = "border-border bg-muted text-muted-foreground";
  } else if (stat.status === "archiviert") {
    label = stat.status_label ?? "Früheres Projekt";
    tone = "border-border bg-muted text-muted-foreground";
  } else if (stat.is_main) {
    label = "Aktuelles Hauptprojekt";
    tone = "border-brand/25 bg-brand/10 text-brand";
  }

  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tone,
        className
      )}
    >
      {label}
    </span>
  );
}
