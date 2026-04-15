"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import type { HeroSlide } from "@/src/types";

export function HeroSection({ slides }: { slides: HeroSlide[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const safeSlides = useMemo(
    () =>
      Array.isArray(slides)
        ? slides.filter((s) => s && (s.desktopImage || s.mobileImage))
        : [],
    [slides],
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-rotating slider
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const id = setInterval(
      () => setIdx((p) => (p + 1) % safeSlides.length),
      5000,
    );
    return () => clearInterval(id);
  }, [safeSlides.length]);

  if (safeSlides.length === 0) {
    return (
      <header className="bg-gradient-to-b from-[var(--color-accent)]/10 to-[var(--color-surface)] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-[var(--color-accent-strong)]">
            Welcome
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Configure hero slider from the admin panel.
          </p>
        </div>
      </header>
    );
  }

  return (
    <section className="relative w-full overflow-hidden pt-16">
      <div className="relative h-[360px] w-full sm:h-[420px] md:h-[520px]">
        {safeSlides.map((s, i) => {
          const active = i === idx;
          const bg = isMobile
            ? s.mobileImage || s.desktopImage
            : s.desktopImage || s.mobileImage;
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${active ? "pointer-events-auto z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
              aria-hidden={!active}
            >
              <div className="relative h-full w-full">
                <Image
                  src={bg as string}
                  alt={s.headline || "Hero slide"}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-black/30">
                  {(() => {
                    const hasText = Boolean(s.headline) || Boolean(s.subheading);
                    return (
                      <div
                        className={`container mx-auto flex h-full flex-col items-center px-4 text-center text-white ${hasText
                          ? "justify-center"
                          : "justify-end pb-10 sm:pb-12 md:pb-14"
                          }`}
                      >
                        {s.headline && (
                          <h1 className="font-display text-4xl font-bold drop-shadow-md md:text-5xl">
                            {s.headline}
                          </h1>
                        )}
                        {s.subheading && (
                          <p className="mt-3 max-w-2xl text-lg drop-shadow md:text-xl">
                            {s.subheading}
                          </p>
                        )}
                        {s.ctaLabel && s.ctaHref && (
                          <div className={hasText ? "mt-6" : "mb-2 mt-3"}>
                            <Button href={s.ctaHref} className="px-6 py-3">
                              {s.ctaLabel}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}

        {/* Dots navigation */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/60"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
