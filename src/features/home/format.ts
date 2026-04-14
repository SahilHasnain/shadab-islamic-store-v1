import type { Product } from "@/src/types";

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getDisplayPrice(product: Product) {
  return {
    original: formatPrice(product.originalPrice ?? product.salePrice),
    final: formatPrice(product.salePrice),
  };
}

export function getDiscountPercentage(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.salePrice) {
    return undefined;
  }

  return Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
}
