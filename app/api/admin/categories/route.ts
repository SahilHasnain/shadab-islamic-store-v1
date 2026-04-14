import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/src/backend/appwrite/server";
import type { AppwriteCategoryDocument } from "@/src/backend/appwrite/types";
import { ensureUniqueSlug } from "@/src/backend/admin/unique-slug";
import { parseCategoryInput } from "@/src/backend/admin/validation";

export async function GET() {
  const result = await listDocuments<AppwriteCategoryDocument>(
    appwriteConfig.collections.categories,
    ['orderAsc("displayOrder")'],
  );
  return NextResponse.json(result.documents);
}

export async function POST(request: Request) {
  try {
    const payload = parseCategoryInput(await request.json());
    const uniqueSlug = await ensureUniqueSlug(
      appwriteConfig.collections.categories,
      payload.slug,
    );
    const document = await createDocument<AppwriteCategoryDocument>(
      appwriteConfig.collections.categories,
      crypto.randomUUID(),
      {
        ...payload,
        slug: uniqueSlug,
      },
    );
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create category" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }
    const payload = parseCategoryInput(body);
    const uniqueSlug = await ensureUniqueSlug(
      appwriteConfig.collections.categories,
      payload.slug,
      body.id,
    );
    const document = await updateDocument<AppwriteCategoryDocument>(
      appwriteConfig.collections.categories,
      body.id,
      {
        ...payload,
        slug: uniqueSlug,
      },
    );
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update category" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }
    await deleteDocument(appwriteConfig.collections.categories, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete category" },
      { status: 400 },
    );
  }
}
