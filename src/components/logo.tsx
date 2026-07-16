import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo artwork is 350x403 px (trimmed); keep that ratio at any size.
// Pass a Tailwind height utility (e.g. "h-9 sm:h-11") via className to
// control the rendered size responsively — width follows automatically.
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Logo Schutz von Wildtieren"
      width={350}
      height={403}
      priority
      className={cn("w-auto shrink-0 object-contain", className)}
    />
  );
}
