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
  const result = await listDocuments<AppwriteSiteSettingsDocument>(appwriteConfig.collections.siteSettings);

  return result.documents[0] ? mapSiteSettings(result.documents[0]) : null;
}

export async function getHeroSlides() {
  const result = await listDocuments<AppwriteHeroSlideDocument>(appwriteConfig.collections.heroSlides);

  return result.documents
    .filter((document) => document.isActive !== false)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map(mapHeroSlide);
}

export async function getTestimonials() {
  const result = await listDocuments<AppwriteTestimonialDocument>(appwriteConfig.collections.testimonials);

  return result.documents
    .filter((document) => document.isActive !== false)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map(mapTestimonial);
}

export async function getFaqs() {
  const result = await listDocuments<AppwriteFaqDocument>(appwriteConfig.collections.faqs);

  return result.documents
    .filter((document) => document.isActive !== false)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map(mapFaq);
}
