"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { ADMIN_NAV_LINKS } from "./admin-nav-links";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Verwaltungsnavigation"
      className="flex h-full flex-col bg-primary text-primary-foreground"
    >
      <div className="flex items-center gap-2 border-b border-primary-foreground/15 px-5 py-5">
        <PawPrint className="size-6" aria-hidden="true" />
        <div>
          <p className="font-heading text-sm font-semibold leading-tight">
            Schutz von Wildtieren
          </p>
          <p className="text-xs text-primary-foreground/60">Verwaltungsbereich</p>
        </div>
      </div>

      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground/85 hover:bg-primary-foreground/10"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-1 border-t border-primary-foreground/15 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/85 hover:bg-primary-foreground/10"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Website ansehen
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/85 hover:bg-primary-foreground/10"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Abmelden
          </button>
        </form>
      </div>
    </nav>
  );
}
