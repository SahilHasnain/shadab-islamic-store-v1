"use client";

import { useEffect, useState } from "react";
import type { AppwriteCategoryDocument } from "@/src/backend/appwrite/types";
import { AdminNoticeBanner } from "@/src/features/admin/admin-notice-banner";
import { readJsonResponse } from "@/src/features/admin/http";
import { ImageGalleryUploadField } from "@/src/features/admin/image-gallery-upload-field";
import { uploadAdminImage } from "@/src/features/admin/upload-image";

interface CategoryFormState {
  title: string;
  description: string;
  displayOrder: string;
  featuredImageIds: string[];
  isActive: boolean;
}

const emptyForm: CategoryFormState = {
  title: "",
  description: "",
  displayOrder: "1",
  featuredImageIds: [],
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AppwriteCategoryDocument[]>([]);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });
      const data = await readJsonResponse<AppwriteCategoryDocument[] | { error?: string }>(
        response,
      );

      if (!response.ok || !data || !Array.isArray(data)) {
        throw new Error(
          data && !Array.isArray(data) ? data.error : "Unable to load categories",
        );
      }

      setCategories(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(category: AppwriteCategoryDocument) {
    setEditingId(category.$id);
    setForm({
      title: category.title,
      description: category.description,
      displayOrder: String(category.displayOrder),
      featuredImageIds: category.featuredImageIds ?? [],
      isActive: category.isActive !== false,
    });
    setError(null);
    setNotice(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          ...form,
        }),
      });

      const data = await readJsonResponse<AppwriteCategoryDocument | { error?: string }>(
        response,
      );

      if (!response.ok) {
        throw new Error(data && "error" in data ? data.error : "Unable to save category");
      }

      if (!data) {
        throw new Error("The server returned an empty response.");
      }

      const nextEditingId = editingId;
      resetForm();
      setNotice(nextEditingId ? "Category updated." : "Category created.");
      await loadCategories();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await readJsonResponse<{ ok?: boolean; error?: string }>(response);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to delete category");
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Category deleted.");
      await loadCategories();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete category");
    }
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    setError(null);

    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="space-y-8">
      <AdminNoticeBanner message={notice} />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Catalog
        </p>
        <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-900">
          Manage categories
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Create and organize storefront categories. Slugs drive the catalog filters and product
          routing.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_1fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">
                {editingId ? "Edit category" : "New category"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Keep names concise and use display order to control storefront sequencing.
              </p>
            </div>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Fresh Vegetables"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                required
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Short catalog description for this category."
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Display order</span>
              <input
                required
                min="1"
                type="number"
                value={form.displayOrder}
                onChange={(event) =>
                  setForm((current) => ({ ...current, displayOrder: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </label>

            <ImageGalleryUploadField
              label="Category images"
              description="Upload one or more images used for category presentation."
              values={form.featuredImageIds}
              uploading={uploadingImage}
              onUpload={handleImageUpload}
              onChange={(values) =>
                setForm((current) => ({ ...current, featuredImageIds: values }))
              }
            />

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({ ...current, isActive: event.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300 text-slate-900"
              />
              <span className="text-sm font-medium text-slate-700">Active category</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Saving..." : editingId ? "Update category" : "Create category"}
            </button>
          </form>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">Existing categories</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {loading ? "Loading categories..." : `${categories.length} categories in Appwrite`}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {!loading && categories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
                No categories yet. Create the first one from the form.
              </div>
            ) : null}

            {categories.map((category) => (
              <article
                key={category.$id}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive !== false
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {category.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Order {category.displayOrder}
                    </p>
                    <p className="max-w-2xl text-sm leading-7 text-slate-600">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(category.$id)}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
