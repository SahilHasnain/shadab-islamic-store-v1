"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  AppwriteCategoryDocument,
  AppwriteProductDocument,
} from "@/src/backend/appwrite/types";
import { ImageGalleryUploadField } from "@/src/features/admin/image-gallery-upload-field";
import { ImageUploadField } from "@/src/features/admin/image-upload-field";
import { uploadAdminImage } from "@/src/features/admin/upload-image";

interface ProductFormState {
  name: string;
  categoryId: string;
  shortDescription: string;
  basePrice: string;
  discountType: "" | "percentage" | "fixed";
  discountValue: string;
  inStock: boolean;
  featured: boolean;
  mainImageId?: string;
  galleryImageIds: string[];
  optionsJson: string;
  isActive: boolean;
}

const emptyForm: ProductFormState = {
  name: "",
  categoryId: "",
  shortDescription: "",
  basePrice: "",
  discountType: "",
  discountValue: "",
  inStock: true,
  featured: false,
  mainImageId: undefined,
  galleryImageIds: [],
  optionsJson: "",
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AppwriteProductDocument[]>([]);
  const [categories, setCategories] = useState<AppwriteCategoryDocument[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);

      const productsData = (await productsResponse.json()) as
        | AppwriteProductDocument[]
        | { error?: string };
      const categoriesData = (await categoriesResponse.json()) as
        | AppwriteCategoryDocument[]
        | { error?: string };

      if (!productsResponse.ok || !Array.isArray(productsData)) {
        throw new Error(Array.isArray(productsData) ? "Unable to load products" : productsData.error);
      }

      if (!categoriesResponse.ok || !Array.isArray(categoriesData)) {
        throw new Error(
          Array.isArray(categoriesData) ? "Unable to load categories" : categoriesData.error,
        );
      }

      setProducts(productsData);
      setCategories(categoriesData);
      setForm((current) =>
        current.categoryId || categoriesData.length === 0
          ? current
          : { ...current, categoryId: categoriesData[0].$id },
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.$id, category])),
    [categories],
  );

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.$id ?? "",
    });
  }

  function startEdit(product: AppwriteProductDocument) {
    setEditingId(product.$id);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      shortDescription: product.shortDescription,
      basePrice: String(product.basePrice),
      discountType: product.discountType ?? "",
      discountValue: product.discountValue === undefined ? "" : String(product.discountValue),
      inStock: product.inStock !== false,
      featured: product.featured === true,
      mainImageId: product.mainImageId ?? undefined,
      galleryImageIds: product.galleryImageIds ?? [],
      optionsJson: product.optionsJson ?? "",
      isActive: product.isActive !== false,
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
      const response = await fetch("/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          ...form,
          discountType: form.discountType || undefined,
          discountValue: form.discountValue,
          mainImageId: form.mainImageId || undefined,
          optionsJson: form.optionsJson.trim() || undefined,
        }),
      });

      const data = (await response.json()) as AppwriteProductDocument | { error?: string };

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Unable to save product");
      }

      const nextEditingId = editingId;
      resetForm();
      setNotice(nextEditingId ? "Product updated." : "Product created.");
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMainImageUpload(file: File) {
    setUploadingMainImage(true);
    setError(null);

    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingMainImage(false);
    }
  }

  async function handleGalleryImageUpload(file: File) {
    setUploadingGalleryImages(true);
    setError(null);

    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingGalleryImages(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete product");
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Product deleted.");
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Catalog
        </p>
        <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-900">
          Manage products
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Create products, assign categories, and control storefront status from one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,30rem)_1fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">
                {editingId ? "Edit product" : "New product"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                This first admin pass covers catalog essentials. Media upload and richer content
                editing can layer on top of this structure next.
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

          {notice ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Fresh Cauliflower"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Category</span>
                <select
                  required
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, categoryId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                >
                  {categories.length === 0 ? <option value="">No categories available</option> : null}
                  {categories.map((category) => (
                    <option key={category.$id} value={category.$id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Short description</span>
              <textarea
                required
                rows={4}
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, shortDescription: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Short product pitch shown in cards and quick views."
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Base price</span>
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.basePrice}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, basePrice: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Discount type</span>
                <select
                  value={form.discountType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      discountType: event.target.value as ProductFormState["discountType"],
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                >
                  <option value="">No discount</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Discount value</span>
                <input
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.discountValue}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, discountValue: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="Optional"
                />
              </label>
            </div>

            <ImageUploadField
              label="Main image"
              description="Upload the primary product image used in product cards and quick view."
              value={form.mainImageId}
              uploading={uploadingMainImage}
              onUpload={handleMainImageUpload}
              onChange={(value) => setForm((current) => ({ ...current, mainImageId: value }))}
            />

            <ImageGalleryUploadField
              label="Gallery images"
              description="Upload additional product images. They will appear in product galleries."
              values={form.galleryImageIds}
              uploading={uploadingGalleryImages}
              onUpload={handleGalleryImageUpload}
              onChange={(values) =>
                setForm((current) => ({ ...current, galleryImageIds: values }))
              }
            />

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Options JSON</span>
              <textarea
                rows={5}
                value={form.optionsJson}
                onChange={(event) =>
                  setForm((current) => ({ ...current, optionsJson: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder='[{"name":"Weight","values":["500g","1kg"]}]'
              />
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, inStock: event.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                />
                <span className="text-sm font-medium text-slate-700">In stock</span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, featured: event.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                />
                <span className="text-sm font-medium text-slate-700">Featured</span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isActive: event.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-slate-900"
                />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || categories.length === 0}
              className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Saving..." : editingId ? "Update product" : "Create product"}
            </button>
          </form>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">Existing products</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {loading ? "Loading products..." : `${products.length} products in Appwrite`}
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-800">
              Create at least one category before adding products.
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {!loading && products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
                No products yet. Create the first one from the form.
              </div>
            ) : null}

            {products.map((product) => {
              const category = categoryMap.get(product.categoryId);

              return (
                <article
                  key={product.$id}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.isActive !== false
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </span>
                        {product.featured ? (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            Featured
                          </span>
                        ) : null}
                        {product.inStock === false ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Out of stock
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {category?.title ?? "Unknown category"}
                      </p>
                      <p className="text-sm leading-7 text-slate-600">{product.shortDescription}</p>
                      <p className="text-sm font-semibold text-slate-900">
                        Rs. {product.basePrice}
                        {product.discountType && product.discountValue !== undefined
                          ? ` | ${product.discountType} discount ${product.discountValue}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(product.$id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
