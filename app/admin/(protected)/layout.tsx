import type { ReactNode } from "react";
import { ProtectedAdminLayout } from "@/src/features/admin/protected-admin-layout";

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedAdminLayout>{children}</ProtectedAdminLayout>;
}
