import type { Category, PriceRange } from "@/src/types";
import { cn } from "@/src/lib/utils";

const priceOptions: Array<{ value: PriceRange; label: string; shortLabel: string }> = [
  { value: "all", label: "All prices", shortLabel: "All" },
  { value: "under-500", label: "Under Rs. 500", shortLabel: "Under 500" },
  { value: "500-1000", label: "Rs. 500 to Rs. 1000", shortLabel: "500-1000" },
  { value: "1000-plus", label: "Above Rs. 1000", shortLabel: "1000+" },
];

interface CatalogSidebarProps {
  categories: Category[];
  counts: Record<string, number>;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPriceRange: PriceRange;
  onPriceRangeChange: (value: PriceRange) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
}

function MobileChipRail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 lg:hidden">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
        {title}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">{children}</div>
    </div>
  );
}

function DesktopFilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hidden lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
        {title}
      </p>
      <div className="mt-4 grid gap-2">{children}</div>
    </div>
  );
}

export function CatalogSidebar({
  categories,
  counts,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
}: CatalogSidebarProps) {
  return (
    <aside className="space-y-5 rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(220,252,231,0.86))] p-4 shadow-[var(--shadow-card)] lg:space-y-6 lg:p-6">
      <MobileChipRail title="Categories">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors",
            selectedCategory === "all"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-white text-[var(--color-ink)]",
          )}
        >
          <span>All</span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px]">
            {counts.all ?? 0}
          </span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.slug)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors",
              selectedCategory === category.slug
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white text-[var(--color-ink)]",
            )}
          >
            <span>{category.title}</span>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px]">
              {counts[category.slug] ?? 0}
            </span>
          </button>
        ))}
      </MobileChipRail>

      <DesktopFilterSection title="Categories">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-colors",
            selectedCategory === "all"
              ? "bg-[var(--color-accent)] text-white"
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
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white text-[var(--color-ink)]",
            )}
          >
            <span>{category.title}</span>
            <span>{counts[category.slug] ?? 0}</span>
          </button>
        ))}
      </DesktopFilterSection>

      <MobileChipRail title="Price">
        {priceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onPriceRangeChange(option.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2.5 text-sm transition-colors",
              selectedPriceRange === option.value
                ? "bg-[var(--color-highlight)] text-white"
                : "bg-white text-[var(--color-ink)]",
            )}
          >
            {option.shortLabel}
          </button>
        ))}
      </MobileChipRail>

      <DesktopFilterSection title="Price">
        {priceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onPriceRangeChange(option.value)}
            className={cn(
              "rounded-2xl px-4 py-3 text-left text-sm transition-colors",
              selectedPriceRange === option.value
                ? "bg-[var(--color-highlight)] text-white"
                : "bg-white text-[var(--color-ink)]",
            )}
          >
            {option.label}
          </button>
        ))}
      </DesktopFilterSection>

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
