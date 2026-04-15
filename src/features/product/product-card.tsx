"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { computeProductPrice } from "@/src/features/catalog/helpers";
import { useCart } from "@/src/features/cart/cart-context";
import { getDiscountPercentage, getDisplayPrice } from "@/src/features/home/format";
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
  const [added, setAdded] = useState(false);

  const hasOptions = Boolean(product.options?.length);
  const unitPrice = computeProductPrice(product).final;
  const discountPercentage = getDiscountPercentage(product);

  // Check if product is new (within 15 days)
  const isNew = (() => {
    try {
      const created = new Date(product.createdAt).getTime();
      const now = Date.now();
      const diffDays = (now - created) / (1000 * 60 * 60 * 24);
      return diffDays <= 15;
    } catch {
      return false;
    }
  })();

  // Hover image swap - use second image from gallery if available
  const hoverImage = product.gallery.length > 1 ? product.gallery[1] : null;

  return (
    <article
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 will-change-transform hover:shadow-lg focus-within:shadow-lg"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View product ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Badges */}
      <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
        {isNew && (
          <span className="pointer-events-auto inline-block rounded-md bg-[var(--color-accent-strong)] px-2 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
            NEW
          </span>
        )}
        {discountPercentage ? (
          <span className="pointer-events-auto inline-block rounded-md bg-[var(--color-highlight)] px-2 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm">
            {discountPercentage}% OFF
          </span>
        ) : null}
      </div>

      {/* Image with hover swap */}
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 lg:h-60"
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={product.name + " alternate"}
            width={400}
            height={300}
            aria-hidden="true"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="pointer-events-none absolute inset-0 h-48 w-full select-none object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:h-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-[var(--color-accent-strong)]">
          {product.name}
        </h3>
        {price.original !== price.final ? (
          <div className="mt-0.5 flex items-baseline gap-2">
            <del className="text-xs text-gray-400 md:text-sm">{price.original}</del>
            <p className="text-md font-semibold text-[var(--color-accent-strong)]">
              {price.final}
            </p>
          </div>
        ) : (
          <p className="text-md mt-0.5">{price.final}</p>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto flex items-center justify-end pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!product.inStock) return;
              if (hasOptions) {
                onClick();
                return;
              }
              if (added) return;

              addItem({
                id: product.id,
                productId: product.id,
                name: product.name,
                unitPrice,
                image: product.image,
              });

              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className={cn(
              "relative h-9 shrink-0 rounded-full px-3 text-xs font-semibold text-white shadow transition-colors focus:outline-none",
              added
                ? "bg-emerald-600"
                : product.inStock
                  ? "bg-[var(--color-accent-strong)] hover:bg-[var(--color-accent)]"
                  : "cursor-not-allowed bg-gray-400",
            )}
            aria-label={
              hasOptions ? `Select options for ${product.name}` : `Add ${product.name} to cart`
            }
            disabled={(!hasOptions && added) || !product.inStock}
          >
            <span
              className={cn(
                "flex items-center justify-center gap-1.5 transition-opacity duration-150",
                !hasOptions && added ? "opacity-0" : "opacity-100",
              )}
            >
              {hasOptions ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M3.75 6h3.75m-3.75 6h9.75m-9.75 6h3.75m6 0h9.75"
                    />
                  </svg>
                  Select options
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m12-8-2 8m-6-8 2 8M10 17h4"
                    />
                  </svg>
                  Add to Cart
                </>
              )}
            </span>
            <span
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center gap-1 text-[11px] tracking-wide transition-opacity duration-150",
                !hasOptions && added ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={hasOptions || !added}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Added
            </span>
          </button>
        </div>
      </div>

      {/* Hover ring */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 transition-[box-shadow] group-hover:ring-2 group-hover:ring-[var(--color-accent)]/30 group-focus-within:ring-2 group-focus-within:ring-[var(--color-accent)]/40" />

      {/* Out of stock overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/55 backdrop-blur-[1px]">
          <span className="rounded-md bg-gray-800/70 px-3 py-1 text-xs font-semibold tracking-wide text-white">
            Out of Stock
          </span>
        </div>
      )}
    </article>
  );
}
