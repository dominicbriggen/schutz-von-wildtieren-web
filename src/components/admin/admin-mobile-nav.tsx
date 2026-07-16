"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { AdminSidebar } from "./admin-sidebar";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground md:hidden">
      <div className="flex items-center gap-2">
        <Logo className="h-7" />
        <span className="text-sm font-semibold">Verwaltungsbereich</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Menü öffnen"
            />
          }
        >
          <Menu className="size-6" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Verwaltungsmenü</SheetTitle>
          <div onClick={() => setOpen(false)} className="h-full">
            <AdminSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
