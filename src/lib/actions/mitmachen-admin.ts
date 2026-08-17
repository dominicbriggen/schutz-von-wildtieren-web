"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-guard";

const REPORT_TABLE = {
  wildseek: "wildseek_reports",
  fence: "fence_reports",
  interest: "project_interests",
} as const;
type Kind = keyof typeof REPORT_TABLE;

const submissionStatus = z.enum(["neu", "gesichtet", "erledigt", "archiviert"]);
const interestStatus = z.enum([
  "neu",
  "kontaktiert",
  "warteliste",
  "zugesagt",
  "abgeschlossen",
  "abgelehnt",
]);
const uuid = z.string().uuid();

function pathFor(kind: Kind): string {
  return kind === "wildseek"
    ? "/admin/wildseek"
    : kind === "fence"
      ? "/admin/weidezaun"
      : "/admin/interessenten";
}

export async function setSubmissionStatus(
  kind: "wildseek" | "fence",
  id: string,
  status: string
) {
  await requireAdmin();
  const parsedId = uuid.safeParse(id);
  const parsedStatus = submissionStatus.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return;

  const supabase = await createClient();
  await supabase
    .from(REPORT_TABLE[kind])
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data);
  revalidatePath(pathFor(kind));
  revalidatePath(`${pathFor(kind)}/${parsedId.data}`);
}

export async function setInterestStatus(id: string, status: string) {
  await requireAdmin();
  const parsedId = uuid.safeParse(id);
  const parsedStatus = interestStatus.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return;

  const supabase = await createClient();
  await supabase
    .from("project_interests")
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data);
  revalidatePath("/admin/interessenten");
  revalidatePath(`/admin/interessenten/${parsedId.data}`);
}

export async function setAdminNote(kind: Kind, id: string, note: string) {
  await requireAdmin();
  const parsedId = uuid.safeParse(id);
  if (!parsedId.success) return;
  const clean = String(note ?? "").slice(0, 5000);

  const supabase = await createClient();
  await supabase
    .from(REPORT_TABLE[kind])
    .update({ admin_note: clean === "" ? null : clean })
    .eq("id", parsedId.data);
  revalidatePath(`${pathFor(kind)}/${parsedId.data}`);
}

export async function deleteSubmission(kind: Kind, id: string) {
  await requireAdmin();
  const parsedId = uuid.safeParse(id);
  if (!parsedId.success) return;

  const supabase = await createClient();
  await supabase.from(REPORT_TABLE[kind]).delete().eq("id", parsedId.data);
  revalidatePath(pathFor(kind));
}

export async function saveMountingTypes(options: string[]) {
  await requireAdmin();
  const clean = Array.from(
    new Set(
      (Array.isArray(options) ? options : [])
        .map((o) => String(o).trim())
        .filter((o) => o !== "")
        .map((o) => o.slice(0, 120))
    )
  ).slice(0, 50);

  const supabase = await createClient();
  await supabase
    .from("content_blocks")
    .upsert({ key: "wildseek_mounting_types", data: { options: clean } });
  revalidatePath("/admin/wildseek");
  revalidatePath("/mitmachen/wildseek");
}
