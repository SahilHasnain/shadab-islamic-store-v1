import { NextResponse } from "next/server";
import { appwriteConfig } from "@/src/backend/appwrite/config";
import {
  createDocument,
  deleteDocument,
  listDocuments,
  updateDocument,
} from "@/src/backend/appwrite/server";
import type { AppwriteTestimonialDocument } from "@/src/backend/appwrite/types";
import { parseTestimonialInput } from "@/src/backend/admin/validation";

export async function GET() {
  try {
    const result = await listDocuments<AppwriteTestimonialDocument>(
      appwriteConfig.collections.testimonials,
    );
    const documents = [...result.documents].sort((left, right) => left.displayOrder - right.displayOrder);
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load testimonials" },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = parseTestimonialInput(await request.json());
    const document = await createDocument<AppwriteTestimonialDocument>(
      appwriteConfig.collections.testimonials,
      crypto.randomUUID(),
      payload,
    );
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create testimonial" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Testimonial id is required" }, { status: 400 });
    }
    const payload = parseTestimonialInput(body);
    const document = await updateDocument<AppwriteTestimonialDocument>(
      appwriteConfig.collections.testimonials,
      body.id,
      payload,
    );
    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update testimonial" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Testimonial id is required" }, { status: 400 });
    }
    await deleteDocument(appwriteConfig.collections.testimonials, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete testimonial" },
      { status: 400 },
    );
  }
}
