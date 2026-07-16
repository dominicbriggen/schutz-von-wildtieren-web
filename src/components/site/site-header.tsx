import Link from "next/link";
import { PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-primary"
        >
          <PawPrint className="size-6" aria-hidden="true" />
          <span>Schutz von Wildtieren</span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Hauptnavigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/unterstuetzen"
            className={cn(buttonVariants(), "hidden sm:inline-flex")}
          >
            Spenden
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
