import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import { resolveAppwriteFileUrl } from "@/src/backend/appwrite/file-url";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
    }

    const uploadForm = new FormData();
    const fileId = crypto.randomUUID();

    uploadForm.append("fileId", fileId);
    uploadForm.append("file", file);

    const response = await fetch(
      `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files`,
      {
        method: "POST",
        headers: {
          "X-Appwrite-Project": appwriteConfig.projectId,
          "X-Appwrite-Key": appwriteConfig.apiKey,
        },
        body: uploadForm,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Upload failed: ${body}`);
    }

    const uploaded = (await response.json()) as { $id: string; name: string };

    return NextResponse.json({
      fileId: uploaded.$id,
      name: uploaded.name,
      url: resolveAppwriteFileUrl(uploaded.$id),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload image" },
      { status: 400 },
    );
  }
}
