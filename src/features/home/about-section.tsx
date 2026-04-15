import Image from "next/image";
import { Container } from "@/src/components/layout/container";
import type { SiteSettings } from "@/src/types";

const benefits = [
  "Authentic products curated with care",
  "Affordable pricing and quick responses",
  "Trusted by our community",
];

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-white py-16">
      <Container className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm justify-self-center md:mx-0">
          <div className="absolute -inset-4 rounded-3xl bg-[var(--color-soft)] opacity-60 blur-md" />
          <Image
            src={settings.businessImage}
            alt={`${settings.businessName} image`}
            width={480}
            height={480}
            className="relative rounded-3xl border-4 border-white shadow-lg"
            priority
          />
        </div>

        <div>
          <h2 className="mb-4 font-display text-3xl font-bold text-[var(--color-accent-strong)] md:text-4xl">
            About {settings.businessName}
          </h2>
          <p className="mb-6 overflow-hidden text-lg leading-relaxed text-[var(--color-muted)]">
            {settings.description}
          </p>
          <ul className="space-y-3 text-[var(--color-muted)]">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-soft)] text-[var(--color-accent-strong)]">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
