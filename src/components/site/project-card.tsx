import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project, ProjectStat } from "@/lib/types";
import { ProjectStatusBadge } from "@/components/site/project-status-badge";

/** Redaktioneller Projektteaser: grosses Bild, klare Trennung, Text direkt auf
 *  der Seitenfläche – bewusst keine schwere Karte, kein Schatten, keine
 *  springende Hover-Bewegung. */
export function ProjectCard({
  project,
  stat,
}: {
  project: Project;
  stat?: ProjectStat | null;
}) {
  return (
    <Link href={`/projekte/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            quality={82}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Kein Bild vorhanden
          </div>
        )}
      </div>
      <div className="mt-4">
        {stat && <ProjectStatusBadge stat={stat} className="mb-2" />}
        <h3 className="text-lg font-semibold leading-snug text-foreground">
          {project.title}
        </h3>
        {project.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Mehr erfahren
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
