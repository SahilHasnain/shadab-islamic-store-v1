import Image from "next/image";
import { Container } from "@/src/components/layout/container";
import { SectionHeading } from "@/src/features/home/section-heading";
import type { SiteSettings } from "@/src/types";

const principles = [
  "Product behavior stays familiar while implementation quality improves.",
  "Mock data keeps UI work unblocked and removes CMS coupling from early phases.",
  "Feature folders keep future catalog and cart work isolated and testable.",
];

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-white p-3 shadow-[var(--shadow-panel)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src={settings.businessImage}
              alt={settings.businessName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
        <div className="space-y-8">
          <SectionHeading
            eyebrow="About Shopsathi"
            title="A curated storefront for modest essentials, gifting, and everyday devotion."
            description={settings.description}
          />
          <div className="grid gap-4">
            {principles.map((principle) => (
              <div
                key={principle}
                className="rounded-[1.75rem] border border-[var(--color-border)] bg-white px-5 py-5 shadow-[var(--shadow-card)]"
              >
                <p className="text-base leading-8 text-[var(--color-muted)]">
                  {principle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
