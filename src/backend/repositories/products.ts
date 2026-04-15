import "server-only";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import { listDocuments } from "@/src/backend/appwrite/server";
import type { AppwriteProductDocument } from "@/src/backend/appwrite/types";
import { mapProduct } from "@/src/backend/mappers/product-mapper";

export async function getProducts() {
  const result = await listDocuments<AppwriteProductDocument>(appwriteConfig.collections.products);

  return result.documents
    .filter((document) => document.isActive !== false)
    .sort((left, right) => right.$createdAt.localeCompare(left.$createdAt))
    .map(mapProduct);
}

export async function getFeaturedProducts() {
  const result = await listDocuments<AppwriteProductDocument>(appwriteConfig.collections.products);

  return result.documents
    .filter((document) => document.isActive !== false && document.featured === true)
    .sort((left, right) => right.$createdAt.localeCompare(left.$createdAt))
    .map(mapProduct);
}
