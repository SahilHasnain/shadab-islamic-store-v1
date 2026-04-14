import { mockSiteContent } from "@/src/data/mock";
import { AboutSection } from "@/src/features/home/about-section";
import { ContactSection } from "@/src/features/home/contact-section";
import { FAQSection } from "@/src/features/home/faq-section";
import { FeaturedProductsSection } from "@/src/features/home/featured-products-section";
import { HeroSection } from "@/src/features/home/hero-section";
import { TestimonialsSection } from "@/src/features/home/testimonials-section";

export function HomePage() {
  const { settings, heroSlides, categories, featuredProducts, testimonials, faqs } =
    mockSiteContent;

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
