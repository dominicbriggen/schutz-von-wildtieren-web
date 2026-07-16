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
import { deleteProject, setProjectStatus } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [, startTransition] = useTransition();

  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Es sind noch keine Projekte vorhanden.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {projects.map((project) => (
        <li key={project.id} className="flex flex-wrap items-center gap-4 p-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
            {project.cover_image_url && (
              <Image src={project.cover_image_url} alt="" fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{project.title}</p>
            <p className="text-xs text-muted-foreground">
              Reihenfolge: {project.order_index}
            </p>
          </div>
          <Select
            defaultValue={project.status}
            onValueChange={(value) =>
              startTransition(() =>
                setProjectStatus(project.id, value as "draft" | "published" | "hidden")
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
            render={<Link href={`/admin/projekte/${project.id}`} />}
          >
            <Pencil className="size-4" />
          </Button>
          <DeleteConfirmDialog
            itemLabel={project.title}
            onConfirm={() => deleteProject(project.id)}
          />
        </li>
      ))}
    </ul>
  );
}
