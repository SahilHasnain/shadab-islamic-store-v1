"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { computeProductPrice } from "@/src/features/catalog/helpers";
import { useCart } from "@/src/features/cart/cart-context";
import { getDisplayPrice, getDiscountPercentage } from "@/src/features/home/format";
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
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const { addItem, openCart } = useCart();

  const price = getDisplayPrice(product);
  const effectivePrice = computeProductPrice(product).final;
  const allImages = product.gallery.length ? product.gallery : [product.image];
  const hasOptions = Boolean(product.options?.length);
  const allOptionsSelected =
    !hasOptions ||
    product.options?.every((group) => Boolean(selectedOptions[group.group])) ||
    false;

  const discountPercentage = getDiscountPercentage(product);

  // Check if product is new
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

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Mobile zoom hint
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    try {
      if (window.localStorage.getItem("zoomHintSeen")) return;
    } catch { }
    setShowMobileHint(true);
    const t = setTimeout(() => {
      setShowMobileHint(false);
      try {
        window.localStorage.setItem("zoomHintSeen", "1");
      } catch { }
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const lineTotal = effectivePrice * qty;
  const priceLine =
    effectivePrice > 0
      ? `${price.final}${qty > 1 ? ` x${qty} = ₹${lineTotal}` : ""}`
      : price.final;

  const message = `${contact.whatsappMessage}\n\nProduct: ${product.name}${buildSelectionsLine(
    selectedOptions,
  )}\nQty: ${qty}\nPrice: ${priceLine}`;

  return (
    <>
      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90"
          onClick={() => setZoomOpen(false)}
        >
          <button
            aria-label="Close zoom"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={allImages[selectedImage] ?? product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div
        aria-modal="true"
        role="dialog"
        className="fixed inset-0 z-[1050] flex items-center justify-center md:z-[60]"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Modal Card */}
        <div className="animate-fade-in relative z-10 flex h-full w-full max-w-none flex-col justify-between overflow-hidden rounded-none bg-white shadow-xl md:mx-4 md:h-auto md:max-h-[90vh] md:max-w-sm md:rounded-2xl">
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-[var(--color-accent-strong)]"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 pr-5">
            {/* Main Image */}
            <div
              className="group relative h-56 w-full cursor-zoom-in overflow-hidden rounded-xl"
              onClick={() => setZoomOpen(true)}
              aria-label="Tap image to zoom"
            >
              <Image
                src={allImages[selectedImage] ?? product.image}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/55 backdrop-blur-[1px]">
                  <span className="rounded-md bg-gray-800/70 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                    Out of Stock
                  </span>
                </div>
              )}
              {showMobileHint && (
                <div className="pointer-events-none absolute bottom-2 left-2 animate-fade-in rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white md:hidden">
                  Tap to Zoom
                </div>
              )}
              <div className="pointer-events-none absolute bottom-2 right-2 hidden items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium leading-none text-white opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 md:inline-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM19.5 19.5l-4.098-4.098"
                  />
                </svg>
                <span>Zoom</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={cn(
                      "h-12 w-12 overflow-hidden rounded-lg border transition focus:outline-none focus:ring-2 ring-[var(--color-accent-strong)]",
                      i === selectedImage
                        ? "border-[var(--color-accent-strong)] ring-1 ring-[var(--color-accent-strong)]"
                        : "border-gray-200 hover:border-[var(--color-accent)]/60",
                    )}
                  >
                    <Image
                      src={img}
                      alt={product.name + " thumbnail " + (i + 1)}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Title + Badges + Price */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <h3 className="flex flex-wrap items-center justify-center gap-2 text-center text-2xl font-semibold text-[var(--color-accent-strong)]">
                <span>{product.name}</span>
                {isNew && (
                  <span className="inline-flex items-center rounded-full bg-[var(--color-accent-strong)] px-2 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
                    NEW
                  </span>
                )}
                {discountPercentage ? (
                  <span className="inline-flex items-center rounded-full bg-[var(--color-highlight)] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow-sm">
                    {discountPercentage}% OFF
                  </span>
                ) : null}
              </h3>
              <div className="text-center">
                {price.original !== price.final ? (
                  <div className="flex items-baseline justify-center gap-2">
                    <del className="text-sm text-gray-400">{price.original}</del>
                    <p className="text-lg font-semibold text-[var(--color-accent-strong)]">
                      {price.final}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg">{price.final}</p>
                )}
              </div>
            </div>

            {/* Options */}
            {product.options?.length ? (
              <div className="mt-4 space-y-4" aria-label="Product options">
                {product.options.map((group) => (
                  <div key={group.group} className="flex flex-col gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {group.group}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map((option) => {
                        const active = selectedOptions[group.group] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((s) => ({
                                ...s,
                                [group.group]:
                                  s[group.group] === option.value ? "" : option.value,
                              }))
                            }
                            className={cn(
                              "h-9 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition focus:outline-none focus:ring-2 ring-[var(--color-accent)]/30",
                              active
                                ? "border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:border-[var(--color-accent)]/60",
                            )}
                            aria-pressed={active}
                            aria-label={`${group.group} option ${option.value}`}
                          >
                            {option.value}
                            {option.priceOverride && (
                              <span className="ml-1 text-[10px] opacity-80">
                                ₹{option.priceOverride}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Quantity Selector */}
            <div
              className="mt-5 flex items-center justify-center gap-4"
              aria-label="Select quantity"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-medium transition hover:bg-gray-50 active:scale-95 disabled:opacity-40"
                  disabled={qty === 1}
                >
                  –
                </button>
                <div className="min-w-[3ch] select-none text-center font-semibold">{qty}</div>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-medium transition hover:bg-gray-50 active:scale-95 disabled:opacity-40"
                  disabled={qty >= 99}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions footer */}
          <div className="flex flex-col gap-3 border-t bg-white p-4 pt-3">
            {!product.inStock && (
              <div className="w-full rounded-md border border-red-200 bg-red-50 py-2 text-center text-sm font-semibold text-red-600">
                Currently Out of Stock
              </div>
            )}

            {/* In-stock actions */}
            {product.inStock && (
              <>
                <button
                  onClick={() => {
                    if (added || !allOptionsSelected || !product.inStock) return;

                    const selectedEntries = product.options
                      ?.map((group) => [group.group, selectedOptions[group.group]!] as [string, string])
                      .filter(([, value]) => Boolean(value)) || [];

                    const variantSuffix = selectedEntries
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(([g, v]) => `${g}=${v}`)
                      .join("|");

                    const variantId = variantSuffix
                      ? `${product.id}::${variantSuffix}`
                      : product.id;

                    addItem({
                      id: variantId,
                      productId: product.id,
                      name: product.name,
                      unitPrice: effectivePrice,
                      image: allImages[selectedImage] ?? product.image,
                      quantity: qty,
                      selections: selectedEntries.map(([group, value]) => ({
                        group,
                        value,
                      })),
                    });

                    setAdded(true);
                    const variantNote = selectedEntries.length
                      ? ` (${selectedEntries.map(([g, v]) => `${g}: ${v}`).join(", ")})`
                      : "";

                    if (typeof window !== "undefined" && window.innerWidth >= 768) {
                      openCart();
                    }
                    setTimeout(() => setAdded(false), 1500);
                  }}
                  className={cn(
                    "relative h-11 w-full rounded-full text-sm font-semibold text-white shadow transition-colors focus:outline-none",
                    !product.inStock
                      ? "cursor-not-allowed bg-gray-400"
                      : added
                        ? "bg-emerald-600"
                        : allOptionsSelected
                          ? "bg-[var(--color-accent-strong)] hover:bg-[var(--color-accent)]"
                          : "cursor-not-allowed bg-gray-300",
                  )}
                  aria-label={`Add ${product.name} to cart`}
                  disabled={added || !allOptionsSelected || !product.inStock}
                >
                  <span
                    className={cn(
                      "transition-opacity duration-150",
                      added ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {product.inStock
                      ? allOptionsSelected
                        ? `Add ${qty} to Cart`
                        : "Select options"
                      : "Out of Stock"}
                  </span>
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 flex items-center justify-center gap-1 text-sm transition-opacity duration-150",
                      added ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={!added}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added
                  </span>
                </button>

                {allOptionsSelected ? (
                  <Button
                    href={buildWhatsAppUrl(contact.whatsappNumber, message)}
                    className="w-full text-center"
                  >
                    {hasOptions && !allOptionsSelected
                      ? "Order on WhatsApp"
                      : `Order ${qty > 1 ? `${qty} pcs` : ""} on WhatsApp`}
                  </Button>
                ) : (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-full bg-gray-300 px-5 py-3 text-sm font-semibold text-white opacity-60"
                  >
                    Select all options first
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
