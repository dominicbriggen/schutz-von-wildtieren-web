import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

// Transactional email via the existing Google-Workspace mailbox (SMTP) — no new
// external service, no DNS change. All configuration comes from server-only env
// vars. If the mailbox credentials are absent, email is silently skipped so a
// missing configuration can never break a form submission.

const HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const PORT = Number(process.env.SMTP_PORT ?? "465");
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

export const MAIL_FROM = process.env.MAIL_FROM ?? USER ?? "";
export const NOTIFY_TO =
  process.env.NOTIFY_TO ?? "info@schutz-von-wildtieren.ch";

export function isEmailConfigured(): boolean {
  return Boolean(USER && PASS);
}

let transporter: Transporter | null = null;
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
      auth: { user: USER, pass: PASS },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn("[email] SMTP not configured – skipping send");
    return;
  }
  const info = await getTransporter().sendMail({
    from: `Schutz von Wildtieren <${MAIL_FROM}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
  });
  // For test SMTP (Ethereal) this yields a viewable preview URL; for real
  // providers it returns false and nothing is logged.
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log(`[email] preview (${opts.to}): ${preview}`);
}
