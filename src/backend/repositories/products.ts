import "server-only";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import { listDocuments } from "@/src/backend/appwrite/server";
import type { AppwriteProductDocument } from "@/src/backend/appwrite/types";
import { mapProduct } from "@/src/backend/mappers/product-mapper";

export async function getProducts() {
  const result = await listDocuments<AppwriteProductDocument>(
    appwriteConfig.collections.products,
    ['equal("isActive", [true])', 'orderDesc("$createdAt")'],
  );

  return result.documents.map(mapProduct);
}

export async function getFeaturedProducts() {
  const result = await listDocuments<AppwriteProductDocument>(
    appwriteConfig.collections.products,
    [
      'equal("isActive", [true])',
      'equal("featured", [true])',
      'orderDesc("$createdAt")',
    ],
  );

  return result.documents.map(mapProduct);
}
