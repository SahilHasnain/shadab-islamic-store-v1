import type { ReactNode } from "react";
import { mockCategories, mockSettings } from "@/src/data/mock";
import { AppFooter } from "@/src/components/layout/app-footer";
import { AppHeader } from "@/src/components/layout/app-header";
import { FloatingWhatsApp } from "@/src/components/layout/floating-whatsapp";
import { CartProvider } from "@/src/features/cart/cart-context";
import { CartDrawer } from "@/src/features/cart/cart-drawer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AppHeader settings={mockSettings} categories={mockCategories} />
      <div className="min-h-[calc(100vh-6rem)]">{children}</div>
      <AppFooter settings={mockSettings} />
      <FloatingWhatsApp contact={mockSettings.contact} />
      <CartDrawer />
    </CartProvider>
  );
}
