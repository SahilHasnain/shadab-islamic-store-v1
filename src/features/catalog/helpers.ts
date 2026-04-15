import type { Category, PriceRange, Product, SortOption } from "@/src/types";

export interface CatalogFilters {
  category: string;
  search: string;
  priceRange: PriceRange;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export function computeProductPrice(product: Product) {
  const base = product.originalPrice ?? product.salePrice;
  const final = product.salePrice;
  return { base, final, discounted: base > final };
}

export function matchesPriceRange(price: number, range: PriceRange) {
  if (range === "all") return true;
  if (range === "under-500") return price < 500;
  if (range === "500-1000") return price >= 500 && price <= 1000;
  return price > 1000;
}

export function getCategoryTitle(slug: string, categories: Category[]) {
  return categories.find((category) => category.slug === slug)?.title ?? slug;
}

export function buildCategoryCounts(
  products: Product[],
  categories: Category[],
  filters: Omit<CatalogFilters, "category" | "sortBy">,
) {
  const entries: Record<string, number> = { all: 0 };

  for (const category of categories) {
    entries[category.slug] = 0;
  }

  for (const product of products) {
    const effectivePrice = computeProductPrice(product).final;
    const matchesSearch =
      !filters.search ||
      `${product.name} ${product.shortDescription}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesStock = !filters.inStockOnly || product.inStock;
    const matchesPrice = matchesPriceRange(effectivePrice, filters.priceRange);

    if (!matchesSearch || !matchesStock || !matchesPrice) continue;

    entries.all += 1;
    entries[product.categorySlug] = (entries[product.categorySlug] ?? 0) + 1;
  }

  return entries;
}

export function filterAndSortProducts(products: Product[], filters: CatalogFilters) {
  const filtered = products.filter((product) => {
    const effectivePrice = computeProductPrice(product).final;
    const matchesCategory =
      filters.category === "all" || product.categorySlug === filters.category;
    const matchesSearch =
      !filters.search ||
      `${product.name} ${product.shortDescription}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    const matchesStock = !filters.inStockOnly || product.inStock;
    const matchesPrice = matchesPriceRange(effectivePrice, filters.priceRange);

    return matchesCategory && matchesSearch && matchesStock && matchesPrice;
  });

  return filtered.sort((left, right) => {
    if (filters.sortBy === "price-asc") {
      return computeProductPrice(left).final - computeProductPrice(right).final;
    }

    if (filters.sortBy === "price-desc") {
      return computeProductPrice(right).final - computeProductPrice(left).final;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
