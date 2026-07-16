"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary"
        >
          <PawPrint className="size-6" aria-hidden="true" />
          <span>Schutz von Wildtieren</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Hauptnavigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-standard",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-primary"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/unterstuetzen"
            className={cn(buttonVariants(), "hidden shadow-sm sm:inline-flex")}
          >
            Spenden
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
