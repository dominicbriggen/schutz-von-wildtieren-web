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
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menü öffnen" />
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
                  className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
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
                className="mt-2 rounded-md bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground hover:bg-primary/90"
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
