"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export function StatusSelect({
  current,
  options,
  action,
  className,
}: {
  current: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  action: (status: string) => Promise<void>;
  className?: string;
}) {
  const [value, setValue] = useState(current);
  const [pending, start] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        start(() => action(v));
      }}
      className={cn(
        "h-9 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        pending && "opacity-60",
        className
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
