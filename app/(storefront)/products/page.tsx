import { Suspense } from "react";
import { getStorefrontData } from "@/src/backend/repositories";
import { CatalogPage } from "@/src/features/catalog/catalog-page";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const storefront = await getStorefrontData();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogPage
        categories={storefront.categories}
        products={storefront.catalogProducts}
        contact={storefront.settings.contact}
      />
    </Suspense>
  );
}
