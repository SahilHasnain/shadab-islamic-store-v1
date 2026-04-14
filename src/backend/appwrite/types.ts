export interface AppwriteListResponse<TDocument> {
  total: number;
  documents: TDocument[];
}

export interface AppwriteDocumentBase {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface AppwriteCategoryDocument extends AppwriteDocumentBase {
  title: string;
  slug: string;
  description: string;
  displayOrder: number;
  featuredImageIds?: string[];
  isActive?: boolean;
}

export interface AppwriteProductDocument extends AppwriteDocumentBase {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  basePrice: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  inStock?: boolean;
  featured?: boolean;
  mainImageId?: string;
  galleryImageIds?: string[];
  optionsJson?: string;
  isActive?: boolean;
}

export interface AppwriteSiteSettingsDocument extends AppwriteDocumentBase {
  businessName: string;
  description: string;
  logoImageId?: string;
  businessImageId?: string;
  featuredProductsTitle?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle?: string;
  mapEmbedUrl?: string;
  newProductThresholdDays: number;
}

export interface AppwriteHeroSlideDocument extends AppwriteDocumentBase {
  eyebrow?: string;
  headline: string;
  subheading?: string;
  desktopImageId: string;
  mobileImageId?: string;
  ctaLabel: string;
  ctaHref: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface AppwriteTestimonialDocument extends AppwriteDocumentBase {
  name: string;
  role?: string;
  text: string;
  rating?: number;
  displayOrder: number;
  isActive?: boolean;
}

export interface AppwriteFaqDocument extends AppwriteDocumentBase {
  question: string;
  answer: string;
  displayOrder: number;
  isActive?: boolean;
}
