import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/src/backend/appwrite/server";
import type { AppwriteProductDocument } from "@/src/backend/appwrite/types";
import { parseProductInput } from "@/src/backend/admin/validation";

export async function GET() {
  const result = await listDocuments<AppwriteProductDocument>(
    appwriteConfig.collections.products,
    ['orderDesc("$createdAt")'],
  );
  return NextResponse.json(result.documents);
}

export async function POST(request: Request) {
  try {
    const payload = parseProductInput(await request.json());
    const document = await createDocument<AppwriteProductDocument>(
      appwriteConfig.collections.products,
      crypto.randomUUID(),
      payload,
    );
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create product" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }
    const payload = parseProductInput(body);
    const document = await updateDocument<AppwriteProductDocument>(
      appwriteConfig.collections.products,
      body.id,
      payload,
    );
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update product" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }
    await deleteDocument(appwriteConfig.collections.products, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete product" },
      { status: 400 },
    );
  }
}
