import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projekte/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-standard hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Kein Bild vorhanden
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        {project.summary && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        )}
        <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-primary">
          Mehr erfahren
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
