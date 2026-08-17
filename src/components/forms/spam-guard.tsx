"use client";

import { useEffect, useRef } from "react";

// Invisible spam defences included in every public form:
//  - a hidden honeypot field real users never fill,
//  - a `form_rendered_at` timestamp stamped on mount so the server can reject
//    submissions that arrive impossibly fast.
export function SpamGuardFields() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);

  return (
    <>
      <input ref={ref} type="hidden" name="form_rendered_at" defaultValue="" />
      <div
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="website">Bitte leer lassen</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </>
  );
}
