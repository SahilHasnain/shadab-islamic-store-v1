"use client";

import { useEffect, useState } from "react";
import { AdminNoticeBanner } from "@/src/features/admin/admin-notice-banner";
import { readJsonResponse } from "@/src/features/admin/http";
import { ImageUploadField } from "@/src/features/admin/image-upload-field";
import { uploadAdminImage } from "@/src/features/admin/upload-image";
import type {
  AppwriteFaqDocument,
  AppwriteHeroSlideDocument,
  AppwriteTestimonialDocument,
} from "@/src/backend/appwrite/types";

interface HeroSlideFormState {
  eyebrow: string;
  headline: string;
  subheading: string;
  desktopImageId?: string;
  mobileImageId?: string;
  ctaLabel: string;
  ctaHref: string;
  displayOrder: string;
  isActive: boolean;
}

interface TestimonialFormState {
  name: string;
  role: string;
  text: string;
  rating: string;
  displayOrder: string;
  isActive: boolean;
}

interface FaqFormState {
  question: string;
  answer: string;
  displayOrder: string;
  isActive: boolean;
}

const emptyHeroSlideForm: HeroSlideFormState = {
  eyebrow: "",
  headline: "",
  subheading: "",
  desktopImageId: undefined,
  mobileImageId: undefined,
  ctaLabel: "",
  ctaHref: "",
  displayOrder: "1",
  isActive: true,
};

const emptyTestimonialForm: TestimonialFormState = {
  name: "",
  role: "",
  text: "",
  rating: "5",
  displayOrder: "1",
  isActive: true,
};

const emptyFaqForm: FaqFormState = {
  question: "",
  answer: "",
  displayOrder: "1",
  isActive: true,
};

export default function AdminContentPage() {
  const [heroSlides, setHeroSlides] = useState<AppwriteHeroSlideDocument[]>([]);
  const [testimonials, setTestimonials] = useState<AppwriteTestimonialDocument[]>([]);
  const [faqs, setFaqs] = useState<AppwriteFaqDocument[]>([]);

  const [heroForm, setHeroForm] = useState<HeroSlideFormState>(emptyHeroSlideForm);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(emptyTestimonialForm);
  const [faqForm, setFaqForm] = useState<FaqFormState>(emptyFaqForm);

  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submittingHero, setSubmittingHero] = useState(false);
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
  const [submittingFaq, setSubmittingFaq] = useState(false);
  const [uploadingDesktopImage, setUploadingDesktopImage] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadContent() {
    setLoading(true);
    setError(null);

    try {
      const [heroResponse, testimonialResponse, faqResponse] = await Promise.all([
        fetch("/api/admin/hero-slides", { cache: "no-store" }),
        fetch("/api/admin/testimonials", { cache: "no-store" }),
        fetch("/api/admin/faqs", { cache: "no-store" }),
      ]);

      const heroData = await readJsonResponse<AppwriteHeroSlideDocument[] | { error?: string }>(
        heroResponse,
      );
      const testimonialData = await readJsonResponse<
        AppwriteTestimonialDocument[] | { error?: string }
      >(testimonialResponse);
      const faqData = await readJsonResponse<AppwriteFaqDocument[] | { error?: string }>(
        faqResponse,
      );

      if (!heroResponse.ok || !heroData || !Array.isArray(heroData)) {
        throw new Error(heroData && !Array.isArray(heroData) ? heroData.error : "Unable to load hero slides");
      }
      if (!testimonialResponse.ok || !testimonialData || !Array.isArray(testimonialData)) {
        throw new Error(
          testimonialData && !Array.isArray(testimonialData)
            ? testimonialData.error
            : "Unable to load testimonials",
        );
      }
      if (!faqResponse.ok || !faqData || !Array.isArray(faqData)) {
        throw new Error(faqData && !Array.isArray(faqData) ? faqData.error : "Unable to load FAQs");
      }

      setHeroSlides(heroData);
      setTestimonials(testimonialData);
      setFaqs(faqData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load content");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function resetHeroForm() {
    setEditingHeroId(null);
    setHeroForm(emptyHeroSlideForm);
  }

  function resetTestimonialForm() {
    setEditingTestimonialId(null);
    setTestimonialForm(emptyTestimonialForm);
  }

  function resetFaqForm() {
    setEditingFaqId(null);
    setFaqForm(emptyFaqForm);
  }

  async function handleHeroSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingHero(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/hero-slides", {
        method: editingHeroId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingHeroId ? { id: editingHeroId } : {}),
          ...heroForm,
          desktopImageId: heroForm.desktopImageId || undefined,
          mobileImageId: heroForm.mobileImageId || undefined,
        }),
      });

      const data = await readJsonResponse<AppwriteHeroSlideDocument | { error?: string }>(response);
      if (!response.ok) {
        throw new Error(data && "error" in data ? data.error : "Unable to save hero slide");
      }

      resetHeroForm();
      setNotice(editingHeroId ? "Hero slide updated." : "Hero slide created.");
      await loadContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save hero slide");
    } finally {
      setSubmittingHero(false);
    }
  }

  async function handleTestimonialSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingTestimonial(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: editingTestimonialId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingTestimonialId ? { id: editingTestimonialId } : {}),
          ...testimonialForm,
        }),
      });

      const data = await readJsonResponse<AppwriteTestimonialDocument | { error?: string }>(
        response,
      );
      if (!response.ok) {
        throw new Error(data && "error" in data ? data.error : "Unable to save testimonial");
      }

      resetTestimonialForm();
      setNotice(editingTestimonialId ? "Testimonial updated." : "Testimonial created.");
      await loadContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save testimonial");
    } finally {
      setSubmittingTestimonial(false);
    }
  }

  async function handleFaqSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingFaq(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/faqs", {
        method: editingFaqId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingFaqId ? { id: editingFaqId } : {}),
          ...faqForm,
        }),
      });

      const data = await readJsonResponse<AppwriteFaqDocument | { error?: string }>(response);
      if (!response.ok) {
        throw new Error(data && "error" in data ? data.error : "Unable to save FAQ");
      }

      resetFaqForm();
      setNotice(editingFaqId ? "FAQ updated." : "FAQ created.");
      await loadContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save FAQ");
    } finally {
      setSubmittingFaq(false);
    }
  }

  async function handleDelete(path: string, id: string, label: string) {
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`${path}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await readJsonResponse<{ ok?: boolean; error?: string }>(response);

      if (!response.ok) {
        throw new Error(data?.error ?? `Unable to delete ${label}`);
      }

      setNotice(`${label} deleted.`);
      await loadContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : `Unable to delete ${label}`);
    }
  }

  async function handleDesktopImageUpload(file: File) {
    setUploadingDesktopImage(true);
    setError(null);
    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingDesktopImage(false);
    }
  }

  async function handleMobileImageUpload(file: File) {
    setUploadingMobileImage(true);
    setError(null);
    try {
      return await uploadAdminImage(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      throw uploadError;
    } finally {
      setUploadingMobileImage(false);
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
          Manage content
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Control homepage hero slides, customer testimonials, and FAQs from one place.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,30rem)_1fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">
                {editingHeroId ? "Edit hero slide" : "New hero slide"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Hero slides power the top section of the homepage.
              </p>
            </div>
            {editingHeroId ? (
              <button
                type="button"
                onClick={resetHeroForm}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleHeroSubmit}>
            <div className="grid gap-6 xl:grid-cols-2">
              <ImageUploadField
                label="Desktop image"
                value={heroForm.desktopImageId}
                uploading={uploadingDesktopImage}
                onUpload={handleDesktopImageUpload}
                onChange={(value) => setHeroForm((current) => ({ ...current, desktopImageId: value }))}
              />
              <ImageUploadField
                label="Mobile image"
                value={heroForm.mobileImageId}
                uploading={uploadingMobileImage}
                onUpload={handleMobileImageUpload}
                onChange={(value) => setHeroForm((current) => ({ ...current, mobileImageId: value }))}
              />
            </div>

            <input
              value={heroForm.eyebrow}
              onChange={(event) => setHeroForm((current) => ({ ...current, eyebrow: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Small text above headline (optional)"
            />
            <input
              required
              value={heroForm.headline}
              onChange={(event) => setHeroForm((current) => ({ ...current, headline: event.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Headline"
            />
            <textarea
              value={heroForm.subheading}
              onChange={(event) => setHeroForm((current) => ({ ...current, subheading: event.target.value }))}
              rows={3}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Subheading"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                value={heroForm.ctaLabel}
                onChange={(event) => setHeroForm((current) => ({ ...current, ctaLabel: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                placeholder="CTA label"
              />
              <input
                required
                value={heroForm.ctaHref}
                onChange={(event) => setHeroForm((current) => ({ ...current, ctaHref: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                placeholder="/products"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-[12rem_auto]">
              <input
                required
                min="1"
                type="number"
                value={heroForm.displayOrder}
                onChange={(event) => setHeroForm((current) => ({ ...current, displayOrder: event.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                placeholder="Order"
              />
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={heroForm.isActive}
                  onChange={(event) => setHeroForm((current) => ({ ...current, isActive: event.target.checked }))}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-700">Active slide</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={submittingHero || loading}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-400"
            >
              {submittingHero ? "Saving..." : editingHeroId ? "Update hero slide" : "Create hero slide"}
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl text-slate-900">Hero slides</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {loading ? "Loading hero slides..." : `${heroSlides.length} slides configured`}
          </p>
          <div className="mt-6 space-y-4">
            {heroSlides.map((slide) => (
              <article key={slide.$id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">{slide.headline}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Order {slide.displayOrder} • {slide.isActive !== false ? "Active" : "Inactive"}
                    </p>
                    {slide.eyebrow ? <p className="text-sm text-slate-600">{slide.eyebrow}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHeroId(slide.$id);
                        setHeroForm({
                          eyebrow: slide.eyebrow ?? "",
                          headline: slide.headline,
                          subheading: slide.subheading ?? "",
                          desktopImageId: slide.desktopImageId,
                          mobileImageId: slide.mobileImageId,
                          ctaLabel: slide.ctaLabel,
                          ctaHref: slide.ctaHref,
                          displayOrder: String(slide.displayOrder),
                          isActive: slide.isActive !== false,
                        });
                      }}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete("/api/admin/hero-slides", slide.$id, "Hero slide")}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">
                {editingTestimonialId ? "Edit testimonial" : "New testimonial"}
              </h2>
            </div>
            {editingTestimonialId ? (
              <button type="button" onClick={resetTestimonialForm} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
                Cancel
              </button>
            ) : null}
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleTestimonialSubmit}>
            <input required value={testimonialForm.name} onChange={(event) => setTestimonialForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Customer name" />
            <input value={testimonialForm.role} onChange={(event) => setTestimonialForm((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Role" />
            <textarea required rows={4} value={testimonialForm.text} onChange={(event) => setTestimonialForm((current) => ({ ...current, text: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Testimonial text" />
            <div className="grid gap-4 md:grid-cols-[12rem_12rem_auto]">
              <input required min="1" max="5" type="number" value={testimonialForm.rating} onChange={(event) => setTestimonialForm((current) => ({ ...current, rating: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Rating" />
              <input required min="1" type="number" value={testimonialForm.displayOrder} onChange={(event) => setTestimonialForm((current) => ({ ...current, displayOrder: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Order" />
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input type="checkbox" checked={testimonialForm.isActive} onChange={(event) => setTestimonialForm((current) => ({ ...current, isActive: event.target.checked }))} className="h-4 w-4" />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>
            <button type="submit" disabled={submittingTestimonial || loading} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-400">
              {submittingTestimonial ? "Saving..." : editingTestimonialId ? "Update testimonial" : "Create testimonial"}
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl text-slate-900">Testimonials</h2>
          <div className="mt-6 space-y-4">
            {testimonials.map((testimonial) => (
              <article key={testimonial.$id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">{testimonial.name}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Order {testimonial.displayOrder} • {testimonial.isActive !== false ? "Active" : "Inactive"}
                    </p>
                    <p className="text-sm leading-7 text-slate-600">{testimonial.text}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => {
                      setEditingTestimonialId(testimonial.$id);
                      setTestimonialForm({
                        name: testimonial.name,
                        role: testimonial.role ?? "",
                        text: testimonial.text,
                        rating: testimonial.rating === undefined ? "" : String(testimonial.rating),
                        displayOrder: String(testimonial.displayOrder),
                        isActive: testimonial.isActive !== false,
                      });
                    }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete("/api/admin/testimonials", testimonial.$id, "Testimonial")} className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-900">
                {editingFaqId ? "Edit FAQ" : "New FAQ"}
              </h2>
            </div>
            {editingFaqId ? (
              <button type="button" onClick={resetFaqForm} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
                Cancel
              </button>
            ) : null}
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleFaqSubmit}>
            <input required value={faqForm.question} onChange={(event) => setFaqForm((current) => ({ ...current, question: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Question" />
            <textarea required rows={4} value={faqForm.answer} onChange={(event) => setFaqForm((current) => ({ ...current, answer: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Answer" />
            <div className="grid gap-4 md:grid-cols-[12rem_auto]">
              <input required min="1" type="number" value={faqForm.displayOrder} onChange={(event) => setFaqForm((current) => ({ ...current, displayOrder: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" placeholder="Order" />
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <input type="checkbox" checked={faqForm.isActive} onChange={(event) => setFaqForm((current) => ({ ...current, isActive: event.target.checked }))} className="h-4 w-4" />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>
            <button type="submit" disabled={submittingFaq || loading} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-400">
              {submittingFaq ? "Saving..." : editingFaqId ? "Update FAQ" : "Create FAQ"}
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl text-slate-900">FAQs</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <article key={faq.$id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Order {faq.displayOrder} • {faq.isActive !== false ? "Active" : "Inactive"}
                    </p>
                    <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => {
                      setEditingFaqId(faq.$id);
                      setFaqForm({
                        question: faq.question,
                        answer: faq.answer,
                        displayOrder: String(faq.displayOrder),
                        isActive: faq.isActive !== false,
                      });
                    }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete("/api/admin/faqs", faq.$id, "FAQ")} className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
