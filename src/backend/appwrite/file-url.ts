import { appwritePublicConfig } from "@/src/backend/appwrite/public";

const appwriteBucketId = "products-media";

export function resolveAppwriteFileUrl(fileId?: string | null) {
  if (!fileId || !appwritePublicConfig.endpoint || !appwritePublicConfig.projectId) {
    return undefined;
  }

  const encodedFileId = encodeURIComponent(fileId);
  return `${appwritePublicConfig.endpoint}/storage/buckets/${appwriteBucketId}/files/${encodedFileId}/view?project=${appwritePublicConfig.projectId}`;
}
