import "server-only";
import { headers } from "next/headers";

// Lightweight, privacy-friendly spam protection for the public forms — no
// captcha, no third-party tracker. Three independent layers:
//   1. Honeypot   – a hidden field real users never fill.
//   2. Timing     – bots submit within milliseconds of load.
//   3. Rate limit – best-effort in-memory sliding window per client IP.
// The IP is only used transiently in memory and is never persisted.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

export async function checkRateLimit(form: string): Promise<boolean> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? "";
  const ip =
    fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = `${form}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false; // rate-limited
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

// Honeypot: the hidden `website` field must stay empty.
export function isHoneypotTripped(formData: FormData): boolean {
  const v = formData.get("website");
  return typeof v === "string" && v.trim() !== "";
}

// Minimum fill time. The client stamps `form_rendered_at` (ms epoch) on mount;
// a submit faster than ~2.5 s is treated as automated. A missing/invalid stamp
// is NOT blocked (the honeypot and rate limit still apply) so that a genuine
// user is never rejected by a timing edge case.
export function isTooFast(formData: FormData): boolean {
  const started = Number(formData.get("form_rendered_at"));
  if (!Number.isFinite(started) || started <= 0) return false;
  const elapsed = Date.now() - started;
  if (elapsed < 0) return false; // clock skew — don't punish
  return elapsed < 2500;
}
