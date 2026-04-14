import "server-only";
import { appwriteConfig } from "@/src/backend/appwrite/config";

export function resolveAppwriteFileUrl(fileId?: string | null) {
  if (!fileId) return undefined;

  const encodedFileId = encodeURIComponent(fileId);
  return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${encodedFileId}/view?project=${appwriteConfig.projectId}`;
}
