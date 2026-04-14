import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import {
  createDocument,
  listDocuments,
  updateDocument,
} from "@/src/backend/appwrite/server";
import type { AppwriteSiteSettingsDocument } from "@/src/backend/appwrite/types";
import { parseSiteSettingsInput } from "@/src/backend/admin/validation";

export async function GET() {
  try {
    const result = await listDocuments<AppwriteSiteSettingsDocument>(
      appwriteConfig.collections.siteSettings,
    );

    return NextResponse.json(result.documents[0] ?? null);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load settings" },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const payload = parseSiteSettingsInput(await request.json());
    const result = await listDocuments<AppwriteSiteSettingsDocument>(
      appwriteConfig.collections.siteSettings,
    );
    const existing = result.documents[0];

    const document = existing
      ? await updateDocument<AppwriteSiteSettingsDocument>(
          appwriteConfig.collections.siteSettings,
          existing.$id,
          payload,
        )
      : await createDocument<AppwriteSiteSettingsDocument>(
          appwriteConfig.collections.siteSettings,
          crypto.randomUUID(),
          payload,
        );

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save settings" },
      { status: 400 },
    );
  }
}
