"use client";

import { useEffect, useState } from "react";
import type { AppwriteSiteSettingsDocument } from "@/src/backend/appwrite/types";
import { AdminNoticeBanner } from "@/src/features/admin/admin-notice-banner";
import { readJsonResponse } from "@/src/features/admin/http";
import { ImageUploadField } from "@/src/features/admin/image-upload-field";
import { uploadAdminImage } from "@/src/features/admin/upload-image";

interface SettingsFormState {
  businessName: string;
  description: string;
  logoImageId?: string;
  businessImageId?: string;
  featuredProductsTitle: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  mapEmbedUrl: string;
  newProductThresholdDays: string;
}

const emptyForm: SettingsFormState = {
  businessName: "",
  description: "",
  logoImageId: undefined,
  businessImageId: undefined,
  featuredProductsTitle: "",
  whatsappNumber: "",
  whatsappMessage: "",
  instagramHandle: "",
  mapEmbedUrl: "",
  newProductThresholdDays: "15",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBusinessImage, setUploadingBusinessImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadSettings() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await readJsonResponse<AppwriteSiteSettingsDocument | { error?: string } | null>(
        response,
      );

      if (!response.ok) {
        throw new Error(data && typeof data === "object" && "error" in data ? data.error : "Unable to load settings");
      }

      if (data && !("error" in data)) {
        setForm({
          businessName: data.businessName,
          description: data.description,
          logoImageId: data.logoImageId,
          businessImageId: data.businessImageId,
          featuredProductsTitle: data.featuredProductsTitle ?? "Featured Products",
          whatsappNumber: data.whatsappNumber,
          whatsappMessage: data.whatsappMessage,
          instagramHandle: data.instagramHandle ?? "",
          mapEmbedUrl: data.mapEmbedUrl ?? "",
          newProductThresholdDays: String(data.newProductThresholdDays),
        });
      } else {
        setForm(emptyForm);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          logoImageId: form.logoImageId || undefined,
          businessImageId: form.businessImageId || undefined,
          instagramHandle: form.instagramHandle.trim() || undefined,
          mapEmbedUrl: form.mapEmbedUrl.trim() || undefined,
        }),
      });

      const data = await readJsonResponse<AppwriteSiteSettingsDocument | { error?: string }>(
        response,
      );

      if (!response.ok) {
        throw new Error(data && "error" in data ? data.error : "Unable to save settings");
      }

      if (!data) {
        throw new Error("The server returned an empty response.");
      }

      setNotice("Settings saved.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      await loadSettings();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save settings");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    setError(null);

    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleBusinessImageUpload(file: File) {
    setUploadingBusinessImage(true);
    setError(null);

    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingBusinessImage(false);
    }
  }

  return (
    <div className="space-y-8">
      <AdminNoticeBanner message={notice} />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Storefront
        </p>
        <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-900">
          Manage settings
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Control the storefront identity, WhatsApp contact flow, featured title, and supporting
          business details from one place.
        </p>
      </div>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="font-display text-3xl text-slate-900">Business settings</h2>
          <p className="text-sm leading-7 text-slate-600">
            {loading ? "Loading current settings..." : "These values drive the public storefront."}
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-2">
            <ImageUploadField
              label="Logo"
              description="Upload the main storefront logo."
              value={form.logoImageId}
              uploading={uploadingLogo}
              onUpload={handleLogoUpload}
              onChange={(value) => setForm((current) => ({ ...current, logoImageId: value }))}
            />

            <ImageUploadField
              label="Business image"
              description="Upload the image used in the homepage about section."
              value={form.businessImageId}
              uploading={uploadingBusinessImage}
              onUpload={handleBusinessImageUpload}
              onChange={(value) =>
                setForm((current) => ({ ...current, businessImageId: value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Business name</span>
              <input
                required
                value={form.businessName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, businessName: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Shopsathi"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Featured section title</span>
              <input
                required
                value={form.featuredProductsTitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    featuredProductsTitle: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Featured Products"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Business description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="Brief storefront description."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">WhatsApp number</span>
              <input
                required
                value={form.whatsappNumber}
                onChange={(event) =>
                  setForm((current) => ({ ...current, whatsappNumber: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="919876543210"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Instagram handle</span>
              <input
                value={form.instagramHandle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, instagramHandle: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="shopsathi.store"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">WhatsApp message</span>
            <textarea
              required
              rows={3}
              value={form.whatsappMessage}
              onChange={(event) =>
                setForm((current) => ({ ...current, whatsappMessage: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="Assalamualaikum, I would like to place an order."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Map embed URL</span>
              <input
                value={form.mapEmbedUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, mapEmbedUrl: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="https://www.google.com/maps/embed?..."
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">New product days</span>
              <input
                required
                min="0"
                type="number"
                value={form.newProductThresholdDays}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    newProductThresholdDays: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? "Saving..." : "Save settings"}
          </button>
        </form>
      </section>
    </div>
  );
}
