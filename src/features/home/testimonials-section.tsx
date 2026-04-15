"use client";

import { Container } from "@/src/components/layout/container";
import type { Testimonial } from "@/src/types";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const isEmpty = testimonials.length === 0;

  return (
    <section className="bg-gradient-to-b from-[var(--color-soft)]/40 to-[var(--color-page)] py-16">
      <Container>
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-[var(--color-accent-strong)] md:mb-0 md:text-4xl">
          What Our Customers Say
        </h2>
        <div className="mx-auto mb-8 mt-0 hidden h-1 w-24 rounded-full bg-[var(--color-accent-strong)] md:block" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {isEmpty && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6"
                >
                  <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-gray-200" />
                    <div className="h-3.5 w-5/6 rounded bg-gray-200" />
                    <div className="h-3.5 w-4/6 rounded bg-gray-200" />
                  </div>
                  <div className="mt-6 h-4 w-24 rounded bg-gray-200" />
                </div>
              ))}
            </>
          )}
          {!isEmpty &&
            testimonials.map((t, i) => (
              <div
                key={t.id}
                className="animate-fade-in rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {typeof t.rating === "number" && (
                  <div
                    className="mb-3 flex items-center"
                    aria-label={`Rating: ${t.rating} out of 5`}
                  >
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg
                        key={idx}
                        className={`h-5 w-5 ${idx < (t.rating ?? 0)
                            ? "text-[var(--color-accent-strong)]"
                            : "text-gray-300"
                          }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                <p className="text-[var(--color-muted)]">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-[var(--color-ink)]">{t.name}</p>
                  {t.role && <p className="text-[var(--color-muted)]">{t.role}</p>}
                </div>
              </div>
            ))}
        </div>
      </Container>
    </section>
  );
}
