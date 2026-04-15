"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/src/features/admin/admin-shell";
import { useAdminAuth } from "@/src/features/admin/admin-auth-context";

export function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <div className="rounded-2xl bg-white px-6 py-5 shadow-sm">Checking session...</div>
      </div>
    );
  }

  if (!admin) return null;

  return <AdminShell>{children}</AdminShell>;
}
