import "server-only";
import {
  getCategories,
  getFaqs,
  getFeaturedProducts,
  getHeroSlides,
  getProducts,
  getSiteSettings,
  getTestimonials,
} from "@/src/backend/repositories";
import type { Product, SiteContent, SiteSettings } from "@/src/types";

const emptySettings: SiteSettings = {
  businessName: "Storefront",
  description: "",
  logoPath: "/placeholder.svg",
  businessImage: "/placeholder.svg",
  featuredProductsTitle: "Featured Products",
  mapEmbedUrl: "",
  contact: {
    whatsappNumber: "",
    whatsappMessage: "",
    instagramHandle: undefined,
  },
  newProductThresholdDays: 15,
};

function attachCategorySlugs(products: Product[], categories: SiteContent["categories"]) {
  const categorySlugById = new Map(categories.map((category) => [category.id, category.slug]));

  return products.map((product) => ({
    ...product,
    categorySlug: categorySlugById.get(product.categorySlug) ?? product.categorySlug,
  }));
}

export async function getStorefrontData(): Promise<SiteContent> {
  try {
    const [settings, categories, featuredProducts, catalogProducts, heroSlides, testimonials, faqs] =
      await Promise.all([
        getSiteSettings(),
        getCategories(),
        getFeaturedProducts(),
        getProducts(),
        getHeroSlides(),
        getTestimonials(),
        getFaqs(),
      ]);

    return {
      settings: settings ?? emptySettings,
      categories,
      featuredProducts: attachCategorySlugs(featuredProducts, categories),
      catalogProducts: attachCategorySlugs(catalogProducts, categories),
      heroSlides,
      testimonials,
      faqs,
    };
  } catch (error) {
    console.error("Unable to load storefront data from Appwrite:", error);
    return {
      settings: emptySettings,
      categories: [],
      featuredProducts: [],
      catalogProducts: [],
      heroSlides: [],
      testimonials: [],
      faqs: [],
    };
  }
}
