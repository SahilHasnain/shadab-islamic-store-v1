function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export interface CategoryInput {
  title: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  featuredImageIds: string[];
}

export function parseCategoryInput(payload: unknown): CategoryInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(data.title)) throw new Error("Category title is required");
  if (!isNonEmptyString(data.description)) throw new Error("Category description is required");

  const title = data.title.trim();
  const slug = slugify(title);
  const displayOrder = Number(data.displayOrder);

  if (!slug) throw new Error("Category slug is required");
  if (!Number.isFinite(displayOrder) || displayOrder < 1) {
    throw new Error("Category display order must be a positive number");
  }

  return {
    title,
    slug,
    description: String(data.description).trim(),
    displayOrder,
    isActive: data.isActive !== false,
    featuredImageIds: Array.isArray(data.featuredImageIds)
      ? data.featuredImageIds.filter((item): item is string => isNonEmptyString(item))
      : [],
  };
}

export interface ProductInput {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  basePrice: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  inStock: boolean;
  featured: boolean;
  mainImageId?: string;
  galleryImageIds: string[];
  optionsJson?: string;
  isActive: boolean;
}

export function parseProductInput(payload: unknown): ProductInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(data.name)) throw new Error("Product name is required");
  if (!isNonEmptyString(data.categoryId)) throw new Error("Category is required");
  if (!isNonEmptyString(data.shortDescription)) {
    throw new Error("Short description is required");
  }

  const name = data.name.trim();
  const slug = slugify(name);
  const basePrice = Number(data.basePrice);
  const discountValue =
    data.discountValue === null || data.discountValue === undefined || data.discountValue === ""
      ? undefined
      : Number(data.discountValue);

  if (!slug) throw new Error("Product slug is required");
  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error("Base price must be a valid non-negative number");
  }
  if (
    discountValue !== undefined &&
    (!Number.isFinite(discountValue) || discountValue < 0)
  ) {
    throw new Error("Discount value must be a valid non-negative number");
  }

  const discountType =
    data.discountType === "percentage" || data.discountType === "fixed"
      ? data.discountType
      : undefined;

  return {
    name,
    slug,
    categoryId: String(data.categoryId).trim(),
    shortDescription: String(data.shortDescription).trim(),
    basePrice,
    discountType,
    discountValue,
    inStock: data.inStock !== false,
    featured: data.featured === true,
    mainImageId: isNonEmptyString(data.mainImageId) ? data.mainImageId.trim() : undefined,
    galleryImageIds: Array.isArray(data.galleryImageIds)
      ? data.galleryImageIds.filter((item): item is string => isNonEmptyString(item))
      : [],
    optionsJson: isNonEmptyString(data.optionsJson) ? data.optionsJson : undefined,
    isActive: data.isActive !== false,
  };
}
