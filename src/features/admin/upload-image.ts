import { readJsonResponse } from "@/src/features/admin/http";

interface UploadImageResult {
  fileId: string;
  name: string;
  url?: string;
}

export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const data = await readJsonResponse<UploadImageResult | { error?: string }>(response);

  if (!response.ok) {
    throw new Error(data && "error" in data ? data.error : "Unable to upload image");
  }

  if (!data) {
    throw new Error("The server returned an empty upload response.");
  }

  return data;
}
