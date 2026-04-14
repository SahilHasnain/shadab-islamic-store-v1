import { listDocuments } from "@/src/backend/appwrite/server";
import type { AppwriteDocumentBase } from "@/src/backend/appwrite/types";

async function slugExists(
  collectionId: string,
  slug: string,
  excludeDocumentId?: string,
) {
  const result = await listDocuments<AppwriteDocumentBase & { slug: string }>(collectionId, [
    `equal("slug", ["${slug}"])`,
  ]);

  return result.documents.some((document) => document.$id !== excludeDocumentId);
}

export async function ensureUniqueSlug(
  collectionId: string,
  baseSlug: string,
  excludeDocumentId?: string,
) {
  let candidate = baseSlug;
  let counter = 2;

  while (await slugExists(collectionId, candidate, excludeDocumentId)) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}
