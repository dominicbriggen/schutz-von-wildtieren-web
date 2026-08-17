import Image from "next/image";
import { cn } from "@/lib/utils";

// Offizielles Vereinslogo (Reh + Tannen im Beige-Kreis), zugeschnitten auf
// den Bildinhalt (465x480 px). Verhältnis bei jeder Grösse beibehalten.
// Höhe per Tailwind-Utility (z. B. "h-8 sm:h-9") übergeben – Breite folgt.
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Logo Schutz von Wildtieren"
      width={465}
      height={480}
      priority
      className={cn("w-auto shrink-0 object-contain", className)}
    />
  );
}
