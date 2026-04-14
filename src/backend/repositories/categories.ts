import "server-only";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import { listDocuments } from "@/src/backend/appwrite/server";
import type { AppwriteCategoryDocument } from "@/src/backend/appwrite/types";
import { mapCategory } from "@/src/backend/mappers/category-mapper";

export async function getCategories() {
  const result = await listDocuments<AppwriteCategoryDocument>(appwriteConfig.collections.categories);

  return result.documents
    .filter((document) => document.isActive !== false)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map(mapCategory);
}
