"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  type AdminAccount,
} from "@/src/features/admin/appwrite-auth";

interface AdminAuthContextValue {
  admin: AdminAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const current = await getCurrentAdmin();
      setAdmin(current);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleLogin(email: string, password: string) {
    await loginAdmin(email, password);
    await refresh();
  }

  async function handleLogout() {
    await logoutAdmin();
    setAdmin(null);
  }

  const value = {
    admin,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refresh,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
