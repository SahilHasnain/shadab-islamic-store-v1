"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { computeProductPrice } from "@/src/features/catalog/helpers";
import { useCart } from "@/src/features/cart/cart-context";
import { getDisplayPrice } from "@/src/features/home/format";
import { cn } from "@/src/lib/utils";
import type { Category, Product } from "@/src/types";

export function ProductCard({
  product,
  category,
  onClick,
}: {
  product: Product;
  category?: Category;
  onClick: () => void;
}) {
  const price = getDisplayPrice(product);
  const { addItem } = useCart();

  const hasOptions = Boolean(product.options?.length);
  const unitPrice = computeProductPrice(product).final;

  return (
    <article
      className="group overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[0_18px_48px_rgba(148,163,184,0.18)]"
    >
      <button type="button" onClick={onClick} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.discountValue ? (
              <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                {product.discountType === "percentage"
                  ? `${product.discountValue}% off`
                  : `₹${product.discountValue} off`}
              </span>
            ) : null}
            {!product.inStock ? (
              <span className="rounded-full bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                Out of stock
              </span>
            ) : null}
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {category?.title ?? product.categorySlug}
            </p>
            <h3 className="font-display text-3xl leading-tight text-[var(--color-ink)]">
              {product.name}
            </h3>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              {product.shortDescription}
            </p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p
                className={cn(
                  "text-sm text-[var(--color-muted)]",
                  price.original !== price.final ? "line-through" : "opacity-0",
                )}
              >
                {price.original}
              </p>
              <p className="font-display text-3xl text-[var(--color-ink)]">
                {price.final}
              </p>
            </div>
          </div>
        </div>
      </button>
      <div className="flex gap-2 px-6 pb-6">
        {product.inStock ? (
          <Button
            variant="secondary"
            className="px-4 py-2.5"
            onClick={() => {
              if (hasOptions) {
                onClick();
                return;
              }

              addItem({
                id: product.id,
                productId: product.id,
                name: product.name,
                unitPrice,
                image: product.image,
              });
            }}
          >
            {hasOptions ? "Select" : "Add to cart"}
          </Button>
        ) : null}
        <Button className="px-4 py-2.5" onClick={onClick}>
          Quick view
        </Button>
      </div>
    </article>
  );
}
