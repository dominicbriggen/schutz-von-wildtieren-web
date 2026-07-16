import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projekte/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card transition-standard hover:-translate-y-1 hover:border-border hover:shadow-card-hover focus-visible:-translate-y-1 focus-visible:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            quality={82}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Kein Bild vorhanden
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="text-lg font-semibold leading-snug text-foreground">
          {project.title}
        </h3>
        {project.summary && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        )}
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand">
          Mehr erfahren
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
