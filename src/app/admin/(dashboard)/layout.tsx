import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { requireAdmin } from "@/lib/auth-guard";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protect every dashboard page: unauthenticated / non-admin users are
  // redirected to the login screen before any admin UI is rendered.
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:block md:w-64 md:shrink-0">
        <div className="fixed h-screen w-64">
          <AdminSidebar />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <div className="flex-1 bg-muted/40 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
