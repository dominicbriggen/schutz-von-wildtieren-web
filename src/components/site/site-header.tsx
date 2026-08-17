"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[0.95rem] font-bold tracking-tight text-primary sm:text-base"
        >
          <Logo className="h-8 sm:h-9" />
          <span className="whitespace-nowrap">Schutz von Wildtieren</span>
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
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
                  "relative py-1 text-sm font-medium transition-standard",
                  isActive
                    ? "text-primary"
                    : "text-foreground/60 hover:text-primary"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[5px] h-px bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/unterstuetzen"
            className={cn(
              buttonVariants({ variant: "brand" }),
              "hidden sm:inline-flex"
            )}
          >
            Unterstützen
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
