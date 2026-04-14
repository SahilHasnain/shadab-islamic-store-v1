import { resolveAppwriteFileUrl } from "@/src/backend/appwrite/storage";
import type {
  AppwriteFaqDocument,
  AppwriteHeroSlideDocument,
  AppwriteSiteSettingsDocument,
  AppwriteTestimonialDocument,
} from "@/src/backend/appwrite/types";
import type { FAQItem, HeroSlide, SiteSettings, Testimonial } from "@/src/types";

export function mapSiteSettings(document: AppwriteSiteSettingsDocument): SiteSettings {
  return {
    businessName: document.businessName,
    description: document.description,
    logoPath: resolveAppwriteFileUrl(document.logoImageId) ?? "/images/logo.png",
    businessImage:
      resolveAppwriteFileUrl(document.businessImageId) ?? "/images/person.jpg",
    featuredProductsTitle: document.featuredProductsTitle ?? "Featured Products",
    mapEmbedUrl: document.mapEmbedUrl ?? "",
    contact: {
      whatsappNumber: document.whatsappNumber,
      whatsappMessage: document.whatsappMessage,
      instagramHandle: document.instagramHandle,
    },
    newProductThresholdDays: document.newProductThresholdDays,
  };
}

export function mapHeroSlide(document: AppwriteHeroSlideDocument): HeroSlide {
  return {
    id: document.$id,
    eyebrow: document.eyebrow ?? "",
    headline: document.headline,
    subheading: document.subheading ?? "",
    desktopImage: resolveAppwriteFileUrl(document.desktopImageId) ?? "/placeholder.svg",
    mobileImage: resolveAppwriteFileUrl(document.mobileImageId),
    ctaLabel: document.ctaLabel,
    ctaHref: document.ctaHref,
  };
}

export function mapTestimonial(document: AppwriteTestimonialDocument): Testimonial {
  return {
    id: document.$id,
    name: document.name,
    role: document.role,
    text: document.text,
    rating: document.rating,
  };
}

export function mapFaq(document: AppwriteFaqDocument): FAQItem {
  return {
    id: document.$id,
    question: document.question,
    answer: document.answer,
  };
}
