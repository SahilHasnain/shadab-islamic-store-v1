import "server-only";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import { listDocuments } from "@/src/backend/appwrite/server";
import type {
  AppwriteFaqDocument,
  AppwriteHeroSlideDocument,
  AppwriteSiteSettingsDocument,
  AppwriteTestimonialDocument,
} from "@/src/backend/appwrite/types";
import {
  mapFaq,
  mapHeroSlide,
  mapSiteSettings,
  mapTestimonial,
} from "@/src/backend/mappers/settings-mapper";

export async function getSiteSettings() {
  const result = await listDocuments<AppwriteSiteSettingsDocument>(
    appwriteConfig.collections.siteSettings,
    ['limit(1)'],
  );

  return result.documents[0] ? mapSiteSettings(result.documents[0]) : null;
}

export async function getHeroSlides() {
  const result = await listDocuments<AppwriteHeroSlideDocument>(
    appwriteConfig.collections.heroSlides,
    ['equal("isActive", [true])', 'orderAsc("displayOrder")'],
  );

  return result.documents.map(mapHeroSlide);
}

export async function getTestimonials() {
  const result = await listDocuments<AppwriteTestimonialDocument>(
    appwriteConfig.collections.testimonials,
    ['equal("isActive", [true])', 'orderAsc("displayOrder")'],
  );

  return result.documents.map(mapTestimonial);
}

export async function getFaqs() {
  const result = await listDocuments<AppwriteFaqDocument>(
    appwriteConfig.collections.faqs,
    ['equal("isActive", [true])', 'orderAsc("displayOrder")'],
  );

  return result.documents.map(mapFaq);
}
