"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { useAdminAuth } from "@/src/features/admin/admin-auth-context";

const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[16rem_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <div>
            <p className="font-display text-3xl text-slate-900">Shadab Islamic Store</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
              Admin Panel
            </p>
          </div>

          <nav className="mt-8 grid gap-2">
            {adminNavigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="text-sm font-semibold text-slate-900">{admin?.email ?? "Unknown"}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </header>

          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
