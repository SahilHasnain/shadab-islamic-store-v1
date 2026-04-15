import { resolveAppwriteFileUrl } from "@/src/backend/appwrite/storage";
import type { AppwriteCategoryDocument } from "@/src/backend/appwrite/types";
import type { Category } from "@/src/types";

export function mapCategory(document: AppwriteCategoryDocument): Category {
  return {
    id: document.$id,
    slug: document.slug,
    title: document.title,
    description: document.description,
    featuredImages: (document.featuredImageIds ?? [])
      .map((fileId) => resolveAppwriteFileUrl(fileId))
      .filter((value): value is string => Boolean(value)),
  };
}
