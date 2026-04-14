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

  const data = (await response.json()) as UploadImageResult | { error?: string };

  if (!response.ok) {
    throw new Error("error" in data ? data.error : "Unable to upload image");
  }

  return data;
}
