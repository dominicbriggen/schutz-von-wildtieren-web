import "server-only";
import { sendMail, isEmailConfigured, NOTIFY_TO } from "./mailer";
import {
  cantonLabel,
  optionLabel,
  FENCE_TYPES,
  PROJECT_INTEREST_OPTIONS,
} from "@/lib/forms/constants";
import { animalsSummary, fmtDate, fmtDateTime } from "@/lib/forms/format";
import type { WildseekInput, FenceInput, InterestInput } from "@/lib/forms/schemas";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://schutz-von-wildtieren.ch";

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"
  );
}

// ── Notification e-mail to the association ──────────────────────────────
function buildNotification(
  title: string,
  fields: [string, string][],
  adminUrl: string
): { html: string; text: string } {
  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:5px 14px 5px 0;color:#5c6a60;vertical-align:top;white-space:nowrap;">${esc(
          k
        )}</td><td style="padding:5px 0;color:#1b2621;">${esc(v)}</td></tr>`
    )
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1b2621;">
  <div style="background:#1d3a2e;color:#f7f4ec;padding:16px 20px;border-radius:8px 8px 0 0;font-size:16px;"><strong>${esc(
    title
  )}</strong></div>
  <div style="border:1px solid #e6ddcc;border-top:none;padding:20px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;color:#5c6a60;font-size:14px;">Es ist eine neue Meldung über die Website eingegangen.</p>
    <table style="border-collapse:collapse;font-size:14px;">${rows}</table>
    <p style="margin:22px 0 0;"><a href="${esc(
      adminUrl
    )}" style="display:inline-block;background:#4a7c59;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:8px;font-size:14px;">Im Dashboard öffnen</a></p>
    <p style="margin:16px 0 0;font-size:12px;color:#8a8f88;">Bilder sind ausschliesslich im geschützten Dashboard einsehbar und werden nicht per E-Mail versendet.</p>
  </div>
</div>`;

  const text = `${title}\n\n${fields
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n\nIm Dashboard öffnen: ${adminUrl}`;

  return { html, text };
}

// ── Confirmation e-mail to the submitter ────────────────────────────────
function buildConfirmation(
  name: string,
  variant: "report" | "interest"
): { subject: string; html: string; text: string } {
  const subject =
    variant === "interest"
      ? "Vielen Dank für Ihr Interesse"
      : "Vielen Dank für Ihre Rückmeldung";
  const body =
    variant === "interest"
      ? "Ihre Angaben sind bei uns eingegangen. Wir melden uns bei Ihnen, sobald eine Teilnahme am entsprechenden Projekt möglich ist."
      : "Ihre Angaben sind bei uns eingegangen und helfen uns, unsere Projekte zu dokumentieren und weiterzuentwickeln.";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1b2621;">
  <div style="border:1px solid #e6ddcc;padding:22px;border-radius:8px;">
    <p style="margin:0 0 12px;">Guten Tag${name ? ` ${esc(name)}` : ""}</p>
    <p style="margin:0 0 12px;">${esc(body)}</p>
    <p style="margin:16px 0 0;color:#5c6a60;font-size:13px;">Diese Nachricht bestätigt lediglich den Eingang Ihrer Angaben. Bitte antworten Sie nicht direkt auf diese automatische E-Mail.</p>
    <p style="margin:18px 0 0;">Freundliche Grüsse<br>Verein Schutz von Wildtieren</p>
  </div>
</div>`;
  const text = `Guten Tag${name ? ` ${name}` : ""}\n\n${body}\n\nDiese Nachricht bestätigt lediglich den Eingang Ihrer Angaben.\n\nFreundliche Grüsse\nVerein Schutz von Wildtieren`;
  return { subject, html, text };
}

async function dispatch(
  subject: string,
  notification: { html: string; text: string },
  submitterEmail: string,
  submitterName: string,
  confirmVariant: "report" | "interest"
): Promise<void> {
  if (!isEmailConfigured()) return;
  const confirm = buildConfirmation(submitterName, confirmVariant);
  // Both e-mails are independent; one failing must not prevent the other, and
  // neither may bubble up (the submission is already saved).
  const results = await Promise.allSettled([
    sendMail({
      to: NOTIFY_TO,
      subject,
      html: notification.html,
      text: notification.text,
      replyTo: submitterEmail,
    }),
    sendMail({
      to: submitterEmail,
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
      replyTo: NOTIFY_TO,
    }),
  ]);
  const labels = ["Benachrichtigung", "Bestätigung"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[email] ${labels[i]} konnte nicht gesendet werden:`,
        r.reason instanceof Error ? r.reason.message : r.reason
      );
    }
  });
}

// ── Per-form senders ────────────────────────────────────────────────────
export async function sendWildseekEmails(
  d: WildseekInput,
  id: string,
  createdAt: string
): Promise<void> {
  const fields: [string, string][] = [
    ["Betrieb / Organisation", d.organization],
    ["Name", `${d.first_name} ${d.last_name}`],
    ["Kanton / Ort", `${cantonLabel(d.canton)} / ${d.municipality}`],
    ["Art der Meldung", "WILDSEEK-Einsatzmeldung"],
    ["Datum", fmtDateTime(createdAt)],
    [
      "Berichtszeitraum",
      d.report_from || d.report_to
        ? `${fmtDate(d.report_from)} – ${fmtDate(d.report_to)}`
        : "—",
    ],
    ["Anzahl Einsätze", d.deployment_count != null ? String(d.deployment_count) : "—"],
    [
      "Montageart",
      d.mounting_type === "andere"
        ? d.mounting_type_other || "Andere"
        : d.mounting_type || "—",
    ],
    ["Gerettete Tiere", d.no_rescue ? "keine" : animalsSummary(d.rescued_animals)],
    ["Bilder", String(d.images?.length ?? 0)],
  ];
  const notification = buildNotification(
    "Neue WILDSEEK-Rückmeldung",
    fields,
    `${SITE}/admin/wildseek/${id}`
  );
  await dispatch(
    "Neue WILDSEEK-Rückmeldung",
    notification,
    d.email,
    `${d.first_name} ${d.last_name}`,
    "report"
  );
}

export async function sendFenceEmails(
  d: FenceInput,
  id: string,
  createdAt: string
): Promise<void> {
  const isComparison = d.report_group === "comparison";
  const subject = isComparison
    ? "Neue Weidezaun-Rückmeldung – Vergleich"
    : "Neue Weidezaun-Rückmeldung – Projekt";
  const fields: [string, string][] = [
    ["Betrieb / Organisation", d.organization],
    ["Name", `${d.first_name} ${d.last_name}`],
    ["Kanton / Ort", `${cantonLabel(d.canton)} / ${d.municipality}`],
    ["Art der Meldung", isComparison ? "Weidezaun – Vergleich" : "Weidezaun – Projekt"],
    ["Datum", fmtDateTime(createdAt)],
    [
      "Zaun",
      isComparison
        ? d.fence_type === "andere"
          ? d.fence_type_other || "Andere"
          : optionLabel(FENCE_TYPES, d.fence_type)
        : d.system_label || "Projektsystem",
    ],
    [
      "Höhe / Länge",
      `${d.fence_height_cm != null ? `${d.fence_height_cm} cm` : "—"} / ${
        d.fence_length_m != null ? `${d.fence_length_m} m` : "—"
      }`,
    ],
    [
      "Beobachtungszeitraum",
      d.observation_from || d.observation_to
        ? `${fmtDate(d.observation_from)} – ${fmtDate(d.observation_to)}`
        : "—",
    ],
    ["Betriebstage", d.operating_days != null ? String(d.operating_days) : "—"],
    [
      "Verhedderungen",
      d.entanglement_occurred
        ? `Ja (${d.entanglement_events?.length ?? 0})`
        : "Nein",
    ],
    ["Wolfsrisse", d.wolf_attack_occurred ? "Ja" : "Nein"],
    ["Bilder", String(d.images?.length ?? 0)],
  ];
  const notification = buildNotification(
    subject,
    fields,
    `${SITE}/admin/weidezaun/${id}`
  );
  await dispatch(
    subject,
    notification,
    d.email,
    `${d.first_name} ${d.last_name}`,
    "report"
  );
}

export async function sendInterestEmails(
  d: InterestInput,
  id: string,
  createdAt: string
): Promise<void> {
  const needParts: string[] = [];
  if (d.wildseek_need) needParts.push(`WILDSEEK: ${d.wildseek_need}`);
  if (d.fence_situation) needParts.push(`Weidezaun: ${d.fence_situation}`);
  const fields: [string, string][] = [
    ["Betrieb / Organisation", d.organization || "—"],
    ["Name", `${d.first_name} ${d.last_name}`],
    [
      "Kanton / Ort",
      `${cantonLabel(d.canton)}${d.city ? ` / ${d.city}` : ""}`,
    ],
    ["Art der Meldung", "Anfrage zur Projektteilnahme"],
    ["Datum", fmtDateTime(createdAt)],
    ["Projekt", optionLabel(PROJECT_INTEREST_OPTIONS, d.project_interest)],
    ["Kontakt", `${d.email}${d.phone ? ` · ${d.phone}` : ""}`],
    ["Bedarf", needParts.length ? needParts.join(" | ") : "—"],
  ];
  const notification = buildNotification(
    "Neue Anfrage zur Projektteilnahme",
    fields,
    `${SITE}/admin/interessenten/${id}`
  );
  await dispatch(
    "Neue Anfrage zur Projektteilnahme",
    notification,
    d.email,
    `${d.first_name} ${d.last_name}`,
    "interest"
  );
}
