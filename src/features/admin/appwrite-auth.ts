"use client";

import { appwritePublicConfig } from "@/src/backend/appwrite/public";

export interface AdminAccount {
  $id: string;
  name?: string;
  email: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return (await response.json()) as T;
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${appwritePublicConfig.endpoint}/account/sessions/email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": appwritePublicConfig.projectId,
    },
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(response);
}

export async function getCurrentAdmin() {
  const response = await fetch(`${appwritePublicConfig.endpoint}/account`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": appwritePublicConfig.projectId,
    },
  });

  if (response.status === 401) return null;

  return parseResponse<AdminAccount>(response);
}

export async function logoutAdmin() {
  const response = await fetch(`${appwritePublicConfig.endpoint}/account/sessions/current`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": appwritePublicConfig.projectId,
    },
  });

  if (response.status === 401) return null;

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Logout failed");
  }

  return true;
}
