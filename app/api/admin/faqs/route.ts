import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/src/backend/appwrite/server";
import type { AppwriteFaqDocument } from "@/src/backend/appwrite/types";
import { parseFaqInput } from "@/src/backend/admin/validation";

export async function GET() {
  try {
    const result = await listDocuments<AppwriteFaqDocument>(appwriteConfig.collections.faqs);
    const documents = [...result.documents].sort((left, right) => left.displayOrder - right.displayOrder);
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load FAQs" },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = parseFaqInput(await request.json());
    const document = await createDocument<AppwriteFaqDocument>(
      appwriteConfig.collections.faqs,
      crypto.randomUUID(),
      payload,
    );
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create FAQ" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "FAQ id is required" }, { status: 400 });
    }
    const payload = parseFaqInput(body);
    const document = await updateDocument<AppwriteFaqDocument>(
      appwriteConfig.collections.faqs,
      body.id,
      payload,
    );
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update FAQ" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "FAQ id is required" }, { status: 400 });
    }
    await deleteDocument(appwriteConfig.collections.faqs, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete FAQ" },
      { status: 400 },
    );
  }
}
