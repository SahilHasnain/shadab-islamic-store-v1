import type { DiscountType, Product } from "@/src/types";

function applyDiscount(
  basePrice: number,
  discountType?: DiscountType,
  discountValue?: number,
) {
  if (!discountType || !discountValue || discountValue <= 0) {
    return basePrice;
  }

  if (discountType === "percentage") {
    return Math.max(0, basePrice * (1 - discountValue / 100));
  }

  return Math.max(0, basePrice - discountValue);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getDisplayPrice(product: Product) {
  return {
    original: formatPrice(product.basePrice),
    final: formatPrice(
      applyDiscount(product.basePrice, product.discountType, product.discountValue),
    ),
  };
}
