import { getStorefrontData } from "@/src/backend/repositories";
import { CatalogPage } from "@/src/features/catalog/catalog-page";

export default async function ProductsPage() {
  const storefront = await getStorefrontData();
  return (
    <CatalogPage
      categories={storefront.categories}
      products={storefront.catalogProducts}
      contact={storefront.settings.contact}
    />
  );
}
