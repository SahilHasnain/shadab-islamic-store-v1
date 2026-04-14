import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/layout/container";
import type { Category, HeroSlide } from "@/src/types";

export function HeroSection({
  slides,
  categories,
}: {
  slides: HeroSlide[];
  categories: Category[];
}) {
  const [primarySlide, secondarySlide] = slides;

  if (!primarySlide) {
    return (
      <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-16">
        <Container>
          <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-white px-8 py-14 text-center shadow-[var(--shadow-panel)] md:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Hero Setup
            </p>
            <h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.05em] text-[var(--color-accent-strong)] md:text-6xl">
              No hero slides published yet.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              Add hero slides from the admin panel to populate the storefront banner.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-16">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(220,252,231,0.88))] p-8 shadow-[var(--shadow-panel)] md:p-12">
          <div className="relative z-10 max-w-2xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {primarySlide.eyebrow}
            </p>
            <h1 className="font-display text-5xl leading-none tracking-[-0.05em] text-[var(--color-accent-strong)] md:text-7xl">
              {primarySlide.headline}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              {primarySlide.subheading}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={primarySlide.ctaHref}>{primarySlide.ctaLabel}</Button>
              <Button href="/products" variant="secondary">
                View all products
              </Button>
            </div>
            <div className="grid gap-3 pt-6 sm:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/90 px-4 py-4 shadow-[var(--shadow-card)]"
                >
                  <p className="font-display text-2xl text-[var(--color-ink)]">
                    {category.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[rgba(34,197,94,0.2)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-6 hidden rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-[var(--shadow-panel)] md:block">
            <Image
              src={primarySlide.desktopImage}
              alt={primarySlide.headline}
              width={220}
              height={220}
              className="rounded-[1.4rem] object-cover"
            />
          </div>
        </div>

        {secondarySlide ? (
          <div className="grid gap-6">
            <div className="grid min-h-[24rem] overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#16a34a,#166534)] text-[var(--color-surface)] shadow-[var(--shadow-panel)]">
              <div className="grid h-full gap-4 p-6 sm:grid-cols-[0.9fr_1.1fr] sm:items-end">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]/70">
                    {secondarySlide.eyebrow}
                  </p>
                  <h2 className="font-display text-3xl leading-tight">
                    {secondarySlide.headline}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--color-cream)]/80">
                    {secondarySlide.subheading}
                  </p>
                  <Button
                    href={secondarySlide.ctaHref}
                    variant="secondary"
                    className="border-white/20 bg-white/10 text-white hover:border-white hover:text-white"
                  >
                    {secondarySlide.ctaLabel}
                  </Button>
                </div>
                <div className="relative min-h-[16rem]">
                  <Image
                    src={secondarySlide.desktopImage}
                    alt={secondarySlide.headline}
                    fill
                    className="rounded-[1.8rem] object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
