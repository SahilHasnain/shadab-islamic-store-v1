import type { Category, PriceRange } from "@/src/types";
import { cn } from "@/src/lib/utils";

const priceOptions: Array<{ value: PriceRange; label: string }> = [
  { value: "all", label: "All prices" },
  { value: "under-500", label: "Under ₹500" },
  { value: "500-1000", label: "₹500 to ₹1000" },
  { value: "1000-plus", label: "Above ₹1000" },
];

export function CatalogSidebar({
  categories,
  counts,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
}: {
  categories: Category[];
  counts: Record<string, number>;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPriceRange: PriceRange;
  onPriceRangeChange: (value: PriceRange) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
}) {
  return (
    <aside className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Categories
        </p>
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-colors",
              selectedCategory === "all"
                ? "bg-[var(--color-ink)] text-[var(--color-surface)]"
                : "bg-white text-[var(--color-ink)]",
            )}
          >
            <span>All products</span>
            <span>{counts.all ?? 0}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-colors",
                selectedCategory === category.slug
                  ? "bg-[var(--color-ink)] text-[var(--color-surface)]"
                  : "bg-white text-[var(--color-ink)]",
              )}
            >
              <span>{category.title}</span>
              <span>{counts[category.slug] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Price
        </p>
        <div className="mt-4 grid gap-2">
          {priceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onPriceRangeChange(option.value)}
              className={cn(
                "rounded-2xl px-4 py-3 text-left text-sm transition-colors",
                selectedPriceRange === option.value
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-white text-[var(--color-ink)]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-sm text-[var(--color-ink)]">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(event) => onInStockOnlyChange(event.target.checked)}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
        <span>Show only in-stock products</span>
      </label>
    </aside>
  );
}
