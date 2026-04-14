import { AboutSection } from "@/src/features/home/about-section";
import { ContactSection } from "@/src/features/home/contact-section";
import { FAQSection } from "@/src/features/home/faq-section";
import { FeaturedProductsSection } from "@/src/features/home/featured-products-section";
import { HeroSection } from "@/src/features/home/hero-section";
import { TestimonialsSection } from "@/src/features/home/testimonials-section";
import type { SiteContent } from "@/src/types";

export function HomePage({
  settings,
  heroSlides,
  categories,
  featuredProducts,
  testimonials,
  faqs,
}: SiteContent) {
  const isEmptyStore =
    heroSlides.length === 0 &&
    categories.length === 0 &&
    featuredProducts.length === 0 &&
    testimonials.length === 0 &&
    faqs.length === 0;

  if (isEmptyStore) {
    return (
      <main className="py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--color-border)] bg-white px-8 py-14 text-center shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Store Setup
          </p>
          <h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.04em] text-[var(--color-accent-strong)]">
            No live storefront content yet.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            The public storefront is now live-data only. Add settings, hero slides, categories,
            and products from the admin panel to publish content here.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <HeroSection slides={heroSlides} categories={categories} />
      <FeaturedProductsSection
        title={settings.featuredProductsTitle}
        products={featuredProducts}
      />
      <AboutSection settings={settings} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <ContactSection settings={settings} />
    </>
  );
}
