import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/src/backend/appwrite/server";
import type { AppwriteHeroSlideDocument } from "@/src/backend/appwrite/types";
import { parseHeroSlideInput } from "@/src/backend/admin/validation";

export async function GET() {
  try {
    const result = await listDocuments<AppwriteHeroSlideDocument>(
      appwriteConfig.collections.heroSlides,
    );
    const documents = [...result.documents].sort((left, right) => left.displayOrder - right.displayOrder);
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load hero slides" },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = parseHeroSlideInput(await request.json());
    const document = await createDocument<AppwriteHeroSlideDocument>(
      appwriteConfig.collections.heroSlides,
      crypto.randomUUID(),
      payload,
    );
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create hero slide" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Hero slide id is required" }, { status: 400 });
    }
    const payload = parseHeroSlideInput(body);
    const document = await updateDocument<AppwriteHeroSlideDocument>(
      appwriteConfig.collections.heroSlides,
      body.id,
      payload,
    );
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update hero slide" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Hero slide id is required" }, { status: 400 });
    }
    await deleteDocument(appwriteConfig.collections.heroSlides, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete hero slide" },
      { status: 400 },
    );
  }
}
