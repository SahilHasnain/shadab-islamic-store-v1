"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/src/components/layout/container";
import { mockCategories, mockCatalogProducts, mockSettings } from "@/src/data/mock";
import { ProductModal } from "@/src/features/product/product-modal";
import { ProductCard } from "@/src/features/product/product-card";
import {
  buildCategoryCounts,
  type CatalogFilters,
  filterAndSortProducts,
  getCategoryTitle,
} from "@/src/features/catalog/helpers";
import { CatalogSidebar } from "@/src/features/catalog/catalog-sidebar";
import { SortSelect } from "@/src/features/catalog/sort-select";
import type { PriceRange, Product, SortOption } from "@/src/types";

function useCatalogFilters(): [CatalogFilters, (next: Partial<CatalogFilters>) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: CatalogFilters = {
    category: searchParams.get("category") ?? "all",
    search: searchParams.get("search") ?? "",
    priceRange: (searchParams.get("price") as PriceRange) ?? "all",
    inStockOnly: searchParams.get("stock") === "in",
    sortBy: (searchParams.get("sort") as SortOption) ?? "latest",
  };

  function updateFilters(next: Partial<CatalogFilters>) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ...filters, ...next };

    if (!merged.category || merged.category === "all") params.delete("category");
    else params.set("category", merged.category);

    if (!merged.search) params.delete("search");
    else params.set("search", merged.search);

    if (merged.priceRange === "all") params.delete("price");
    else params.set("price", merged.priceRange);

    if (!merged.inStockOnly) params.delete("stock");
    else params.set("stock", "in");

    if (merged.sortBy === "latest") params.delete("sort");
    else params.set("sort", merged.sortBy);

    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  return [filters, updateFilters];
}

export function CatalogPage() {
  const [filters, updateFilters] = useCatalogFilters();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(
    () => filterAndSortProducts([...mockCatalogProducts], filters),
    [filters],
  );

  const categoryCounts = useMemo(
    () =>
      buildCategoryCounts(mockCatalogProducts, mockCategories, {
        search: filters.search,
        inStockOnly: filters.inStockOnly,
        priceRange: filters.priceRange,
      }),
    [filters.inStockOnly, filters.priceRange, filters.search],
  );

  return (
    <>
      <main className="py-14 md:py-18">
        <Container className="space-y-10">
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Catalog
            </p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-[var(--color-accent-strong)] md:text-6xl">
                  Browse the full storefront.
                </h1>
                <p className="text-lg leading-8 text-[var(--color-muted)]">
                  Explore curated products, compare prices, and open any item for full details before ordering.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={filters.search}
                  onChange={(event) => updateFilters({ search: event.target.value })}
                  placeholder="Search products"
                  className="h-12 rounded-full border border-[var(--color-border)] bg-white px-5 text-sm text-[var(--color-ink)] shadow-[var(--shadow-card)]"
                />
                <SortSelect
                  value={filters.sortBy}
                  onChange={(value) => updateFilters({ sortBy: value })}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
              <span>
                Category:{" "}
                <strong className="text-[var(--color-ink)]">
                  {filters.category === "all"
                    ? "All products"
                    : getCategoryTitle(filters.category, mockCategories)}
                </strong>
              </span>
              <span>
                Results:{" "}
                <strong className="text-[var(--color-ink)]">{filteredProducts.length}</strong>
              </span>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <CatalogSidebar
              categories={mockCategories}
              counts={categoryCounts}
              selectedCategory={filters.category}
              onCategoryChange={(value) => updateFilters({ category: value })}
              selectedPriceRange={filters.priceRange}
              onPriceRangeChange={(value) => updateFilters({ priceRange: value })}
              inStockOnly={filters.inStockOnly}
              onInStockOnlyChange={(value) => updateFilters({ inStockOnly: value })}
            />

            <div className="space-y-6">
              {filteredProducts.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      category={mockCategories.find(
                        (category) => category.slug === product.categorySlug,
                      )}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 text-center shadow-[var(--shadow-card)]">
                  <p className="font-display text-3xl text-[var(--color-ink)]">
                    No products match these filters.
                  </p>
                  <p className="mt-3 text-base leading-8 text-[var(--color-muted)]">
                    Try clearing the search term or widening the price range.
                  </p>
                </div>
              )}
            </div>
          </section>
        </Container>
      </main>

      <ProductModal
        product={selectedProduct}
        contact={mockSettings.contact}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
