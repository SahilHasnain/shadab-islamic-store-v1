import { resolveAppwriteFileUrl } from "@/src/backend/appwrite/storage";
import type { AppwriteProductDocument } from "@/src/backend/appwrite/types";
import type { Product, ProductOptionGroup } from "@/src/types";

function parseOptionsJson(raw?: string): ProductOptionGroup[] | undefined {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as ProductOptionGroup[];
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function mapProduct(document: AppwriteProductDocument): Product {
  const mainImage = resolveAppwriteFileUrl(document.mainImageId) ?? "/placeholder.svg";
  const galleryImages = (document.galleryImageIds ?? [])
    .map((fileId) => resolveAppwriteFileUrl(fileId))
    .filter((value): value is string => Boolean(value));

  return {
    id: document.$id,
    slug: document.slug,
    name: document.name,
    categorySlug: document.categoryId,
    basePrice: document.basePrice,
    image: mainImage,
    gallery: galleryImages.length ? [mainImage, ...galleryImages] : [mainImage],
    shortDescription: document.shortDescription,
    inStock: document.inStock ?? true,
    featured: document.featured ?? false,
    createdAt: document.$createdAt,
    discountType: document.discountType,
    discountValue: document.discountValue,
    options: parseOptionsJson(document.optionsJson),
  };
}
