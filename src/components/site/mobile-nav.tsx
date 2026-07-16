"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Menü öffnen" />
        }
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menü</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label="Hauptnavigation (mobil)">
          {NAV_LINKS.map((link) => (
            <SheetClose
              key={link.href}
              nativeButton={false}
              render={
                <Link
                  href={link.href}
                  className="rounded-xl px-3.5 py-3 text-base font-medium text-foreground transition-standard hover:bg-muted"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href="/unterstuetzen"
                className="mt-3 rounded-xl bg-brand px-3.5 py-3 text-center text-base font-semibold text-brand-foreground shadow-sm transition-standard hover:bg-[color-mix(in_oklch,var(--brand),black_12%)]"
              />
            }
          >
            Spenden
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
