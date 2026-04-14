export type DiscountType = "percentage" | "fixed";

export type PriceRange = "all" | "under-500" | "500-1000" | "1000-plus";

export type SortOption = "latest" | "price-asc" | "price-desc";

export interface SiteContact {
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle?: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subheading: string;
  desktopImage: string;
  mobileImage?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteSettings {
  businessName: string;
  description: string;
  logoPath: string;
  businessImage: string;
  featuredProductsTitle: string;
  mapEmbedUrl: string;
  contact: SiteContact;
  newProductThresholdDays: number;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  featuredImages: string[];
}

export interface ProductOptionValue {
  value: string;
  priceOverride?: number;
  image?: string;
}

export interface ProductOptionGroup {
  group: string;
  values: ProductOptionValue[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  basePrice: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  discountType?: DiscountType;
  discountValue?: number;
  options?: ProductOptionGroup[];
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CartSelection {
  group: string;
  value: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  image: string;
  quantity: number;
  selections: CartSelection[];
}

export interface SiteContent {
  settings: SiteSettings;
  heroSlides: HeroSlide[];
  categories: Category[];
  featuredProducts: Product[];
  catalogProducts: Product[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
}
