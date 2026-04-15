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
  discountType?: "fixed";
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
  const salePrice = Number(data.salePrice);
  const originalPrice =
    data.originalPrice === null || data.originalPrice === undefined || data.originalPrice === ""
      ? undefined
      : Number(data.originalPrice);

  if (!slug) throw new Error("Product slug is required");
  if (!Number.isFinite(salePrice) || salePrice < 0) {
    throw new Error("Sale price must be a valid non-negative number");
  }
  if (
    originalPrice !== undefined &&
    (!Number.isFinite(originalPrice) || originalPrice < 0)
  ) {
    throw new Error("Original price must be a valid non-negative number");
  }
  if (originalPrice !== undefined && originalPrice < salePrice) {
    throw new Error("Original price must be greater than or equal to sale price");
  }

  const discountValue =
    originalPrice !== undefined && originalPrice > salePrice
      ? originalPrice - salePrice
      : undefined;

  return {
    name,
    slug,
    categoryId: String(data.categoryId).trim(),
    shortDescription: String(data.shortDescription).trim(),
    basePrice: originalPrice ?? salePrice,
    discountType: discountValue !== undefined ? "fixed" : undefined,
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

export interface SiteSettingsInput {
  businessName: string;
  description: string;
  logoImageId?: string;
  businessImageId?: string;
  featuredProductsTitle: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle?: string;
  mapEmbedUrl?: string;
  newProductThresholdDays: number;
}

export function parseSiteSettingsInput(payload: unknown): SiteSettingsInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(data.businessName)) {
    throw new Error("Business name is required");
  }
  if (!isNonEmptyString(data.description)) {
    throw new Error("Business description is required");
  }
  if (!isNonEmptyString(data.featuredProductsTitle)) {
    throw new Error("Featured products title is required");
  }
  if (!isNonEmptyString(data.whatsappNumber)) {
    throw new Error("WhatsApp number is required");
  }
  if (!isNonEmptyString(data.whatsappMessage)) {
    throw new Error("WhatsApp message is required");
  }

  const newProductThresholdDays = Number(data.newProductThresholdDays);

  if (!Number.isFinite(newProductThresholdDays) || newProductThresholdDays < 0) {
    throw new Error("New product threshold days must be a valid non-negative number");
  }

  return {
    businessName: String(data.businessName).trim(),
    description: String(data.description).trim(),
    logoImageId: isNonEmptyString(data.logoImageId) ? data.logoImageId.trim() : undefined,
    businessImageId: isNonEmptyString(data.businessImageId)
      ? data.businessImageId.trim()
      : undefined,
    featuredProductsTitle: String(data.featuredProductsTitle).trim(),
    whatsappNumber: String(data.whatsappNumber).trim(),
    whatsappMessage: String(data.whatsappMessage).trim(),
    instagramHandle: isNonEmptyString(data.instagramHandle)
      ? data.instagramHandle.trim()
      : undefined,
    mapEmbedUrl: isNonEmptyString(data.mapEmbedUrl) ? data.mapEmbedUrl.trim() : undefined,
    newProductThresholdDays,
  };
}

export interface HeroSlideInput {
  eyebrow?: string;
  headline: string;
  subheading?: string;
  desktopImageId: string;
  mobileImageId?: string;
  ctaLabel: string;
  ctaHref: string;
  displayOrder: number;
  isActive: boolean;
}

export function parseHeroSlideInput(payload: unknown): HeroSlideInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(data.headline)) {
    throw new Error("Hero headline is required");
  }
  if (!isNonEmptyString(data.desktopImageId)) {
    throw new Error("Hero desktop image is required");
  }
  if (!isNonEmptyString(data.ctaLabel)) {
    throw new Error("Hero CTA label is required");
  }
  if (!isNonEmptyString(data.ctaHref)) {
    throw new Error("Hero CTA link is required");
  }

  const displayOrder = Number(data.displayOrder);

  if (!Number.isFinite(displayOrder) || displayOrder < 1) {
    throw new Error("Hero display order must be a positive number");
  }

  return {
    eyebrow: isNonEmptyString(data.eyebrow) ? data.eyebrow.trim() : undefined,
    headline: String(data.headline).trim(),
    subheading: isNonEmptyString(data.subheading) ? data.subheading.trim() : undefined,
    desktopImageId: String(data.desktopImageId).trim(),
    mobileImageId: isNonEmptyString(data.mobileImageId) ? data.mobileImageId.trim() : undefined,
    ctaLabel: String(data.ctaLabel).trim(),
    ctaHref: String(data.ctaHref).trim(),
    displayOrder,
    isActive: data.isActive !== false,
  };
}

export interface TestimonialInput {
  name: string;
  role?: string;
  text: string;
  rating?: number;
  displayOrder: number;
  isActive: boolean;
}

export function parseTestimonialInput(payload: unknown): TestimonialInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(data.name)) {
    throw new Error("Customer name is required");
  }
  if (!isNonEmptyString(data.text)) {
    throw new Error("Testimonial text is required");
  }

  const displayOrder = Number(data.displayOrder);
  const rating =
    data.rating === null || data.rating === undefined || data.rating === ""
      ? undefined
      : Number(data.rating);

  if (!Number.isFinite(displayOrder) || displayOrder < 1) {
    throw new Error("Testimonial display order must be a positive number");
  }
  if (rating !== undefined && (!Number.isFinite(rating) || rating < 1 || rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  return {
    name: String(data.name).trim(),
    role: isNonEmptyString(data.role) ? data.role.trim() : undefined,
    text: String(data.text).trim(),
    rating,
    displayOrder,
    isActive: data.isActive !== false,
  };
}

export interface FaqInput {
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export function parseFaqInput(payload: unknown): FaqInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(data.question)) {
    throw new Error("FAQ question is required");
  }
  if (!isNonEmptyString(data.answer)) {
    throw new Error("FAQ answer is required");
  }

  const displayOrder = Number(data.displayOrder);

  if (!Number.isFinite(displayOrder) || displayOrder < 1) {
    throw new Error("FAQ display order must be a positive number");
  }

  return {
    question: String(data.question).trim(),
    answer: String(data.answer).trim(),
    displayOrder,
    isActive: data.isActive !== false,
  };
}
