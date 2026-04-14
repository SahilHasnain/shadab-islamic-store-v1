import "server-only";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import type { AppwriteListResponse } from "@/src/backend/appwrite/types";

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": appwriteConfig.projectId,
  "X-Appwrite-Key": appwriteConfig.apiKey,
};

async function request<T>(route: string, init?: RequestInit) {
  const response = await fetch(`${appwriteConfig.endpoint}${route}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite request failed: ${response.status} ${route} ${body}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function buildListRoute(collectionId: string, queries: string[] = []) {
  const search = new URLSearchParams();
  for (const query of queries) {
    search.append("queries[]", query);
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents${suffix}`;
}

export async function listDocuments<TDocument>(
  collectionId: string,
  queries: string[] = [],
) {
  return request<AppwriteListResponse<TDocument>>(buildListRoute(collectionId, queries));
}

export async function getDocument<TDocument>(collectionId: string, documentId: string) {
  return request<TDocument>(
    `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents/${documentId}`,
  );
}
