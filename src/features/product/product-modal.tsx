"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { computeProductPrice } from "@/src/features/catalog/helpers";
import { useCart } from "@/src/features/cart/cart-context";
import { getDisplayPrice } from "@/src/features/home/format";
import { buildWhatsAppUrl, cn } from "@/src/lib/utils";
import type { Product, SiteContact } from "@/src/types";

function buildSelectionsLine(selectedOptions: Record<string, string>) {
  const selections = Object.entries(selectedOptions).filter(([, value]) => value);
  if (!selections.length) return "";
  return `\nOptions: ${selections.map(([group, value]) => `${group}: ${value}`).join(", ")}`;
}

export function ProductModal({
  product,
  contact,
  onClose,
}: {
  product: Product | null;
  contact: SiteContact;
  onClose: () => void;
}) {
  if (!product) return null;

  return (
    <ProductModalContent
      key={product.id}
      product={product}
      contact={contact}
      onClose={onClose}
    />
  );
}

function ProductModalContent({
  product,
  contact,
  onClose,
}: {
  product: Product;
  contact: SiteContact;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem } = useCart();

  const price = getDisplayPrice(product);
  const effectivePrice = computeProductPrice(product).final;
  const allImages = product.gallery.length ? product.gallery : [product.image];
  const hasOptions = Boolean(product.options?.length);
  const allOptionsSelected =
    !hasOptions ||
    product.options?.every((group) => Boolean(selectedOptions[group.group])) ||
    false;

  const message = `${contact.whatsappMessage}\n\nProduct: ${product.name}${buildSelectionsLine(
    selectedOptions,
  )}\nPrice: ${price.final}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.64)] p-4">
      <button
        type="button"
        aria-label="Close product modal"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[2rem] bg-[var(--color-surface)] shadow-[0_30px_100px_rgba(15,23,42,0.25)]">
        <div className="grid gap-8 p-5 md:grid-cols-[0.95fr_1.05fr] md:p-8">
          <div className="space-y-4">
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white">
              <Image
                src={allImages[selectedImage] ?? product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((image, index) => (
                <button
                  key={`${product.id}-${image}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-2xl border bg-white",
                    selectedImage === index
                      ? "border-[var(--color-accent)]"
                      : "border-[var(--color-border)]",
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {product.categorySlug}
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] text-[var(--color-ink)]">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-xl text-[var(--color-ink)]"
                aria-label="Close product modal"
              >
                ×
              </button>
            </div>

            <div>
              {price.original !== price.final ? (
                <p className="text-sm text-[var(--color-muted)] line-through">
                  {price.original}
                </p>
              ) : null}
              <p className="font-display text-4xl text-[var(--color-ink)]">{price.final}</p>
            </div>

            <p className="text-base leading-8 text-[var(--color-muted)]">
              {product.shortDescription}
            </p>

            {product.options?.length ? (
              <div className="space-y-5">
                {product.options.map((group) => (
                  <div key={group.group} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {group.group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map((option) => {
                        const active = selectedOptions[group.group] === option.value;

                        return (
                          <button
                            key={`${group.group}-${option.value}`}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((current) => ({
                                ...current,
                                [group.group]: option.value,
                              }))
                            }
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm transition-colors",
                              active
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                : "border-[var(--color-border)] bg-white text-[var(--color-ink)]",
                            )}
                          >
                            {option.value}
                            {option.priceOverride ? ` • ₹${option.priceOverride}` : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-auto flex flex-wrap gap-3">
              {product.inStock ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    addItem({
                      id: `${product.id}${Object.entries(selectedOptions)
                        .filter(([, value]) => value)
                        .map(([group, value]) => `::${group}=${value}`)
                        .join("")}`,
                      productId: product.id,
                      name: product.name,
                      unitPrice: effectivePrice,
                      image: allImages[selectedImage] ?? product.image,
                      selections: Object.entries(selectedOptions)
                        .filter(([, value]) => value)
                        .map(([group, value]) => ({ group, value })),
                    })
                  }
                  className={cn(!allOptionsSelected ? "pointer-events-none opacity-50" : "")}
                >
                  Add to cart
                </Button>
              ) : null}
              <Button
                href={
                  product.inStock && allOptionsSelected
                    ? buildWhatsAppUrl(contact.whatsappNumber, message)
                    : "#"
                }
                className={cn(
                  "min-w-[12rem]",
                  !product.inStock || !allOptionsSelected
                    ? "pointer-events-none opacity-50"
                    : "",
                )}
              >
                {product.inStock ? "Order on WhatsApp" : "Out of stock"}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
            {hasOptions && !allOptionsSelected ? (
              <p className="text-sm text-[var(--color-muted)]">
                Select all required options before continuing to WhatsApp.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
