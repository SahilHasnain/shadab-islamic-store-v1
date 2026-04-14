import type { ReactNode } from "react";
import { getStorefrontData } from "@/src/backend/repositories";
import { AppFooter } from "@/src/components/layout/app-footer";
import { AppHeader } from "@/src/components/layout/app-header";
import { FloatingWhatsApp } from "@/src/components/layout/floating-whatsapp";
import { CartProvider } from "@/src/features/cart/cart-context";
import { CartDrawer } from "@/src/features/cart/cart-drawer";

export async function AppShell({ children }: { children: ReactNode }) {
  const storefront = await getStorefrontData();

  return (
    <CartProvider>
      <AppHeader settings={storefront.settings} categories={storefront.categories} />
      <div className="min-h-[calc(100vh-6rem)]">{children}</div>
      <AppFooter settings={storefront.settings} />
      <FloatingWhatsApp contact={storefront.settings.contact} />
      <CartDrawer contact={storefront.settings.contact} />
    </CartProvider>
  );
}
