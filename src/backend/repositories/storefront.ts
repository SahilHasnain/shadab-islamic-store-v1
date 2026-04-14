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
import {
  mockCategories,
  mockFaqs,
  mockFeaturedProducts,
  mockHeroSlides,
  mockSettings,
  mockTestimonials,
  mockCatalogProducts,
} from "@/src/data/mock";
import type { Product, SiteContent } from "@/src/types";

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

    if (!settings) {
      return {
        settings: mockSettings,
        categories: mockCategories,
        featuredProducts: mockFeaturedProducts,
        catalogProducts: mockCatalogProducts,
        heroSlides: mockHeroSlides,
        testimonials: mockTestimonials,
        faqs: mockFaqs,
      };
    }

    return {
      settings,
      categories: categories.length ? categories : mockCategories,
      featuredProducts: attachCategorySlugs(
        featuredProducts.length ? featuredProducts : mockFeaturedProducts,
        categories.length ? categories : mockCategories,
      ),
      catalogProducts: attachCategorySlugs(
        catalogProducts.length ? catalogProducts : mockCatalogProducts,
        categories.length ? categories : mockCategories,
      ),
      heroSlides: heroSlides.length ? heroSlides : mockHeroSlides,
      testimonials: testimonials.length ? testimonials : mockTestimonials,
      faqs: faqs.length ? faqs : mockFaqs,
    };
  } catch (error) {
    console.error("Falling back to mock storefront data:", error);
    return {
      settings: mockSettings,
      categories: mockCategories,
      featuredProducts: mockFeaturedProducts,
      catalogProducts: mockCatalogProducts,
      heroSlides: mockHeroSlides,
      testimonials: mockTestimonials,
      faqs: mockFaqs,
    };
  }
}
