import type { SortOption } from "@/src/types";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <select
      aria-label="Sort products"
      value={value}
      onChange={(event) => onChange(event.target.value as SortOption)}
      className="h-12 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
    >
      <option value="latest">Latest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
