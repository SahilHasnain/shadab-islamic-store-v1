"use client";

import { Container } from "@/src/components/layout/container";
import type { FAQItem } from "@/src/types";

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  const isEmpty = faqs.length === 0;

  return (
    <section className="bg-white py-16">
      <Container className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-[var(--color-accent-strong)] md:mb-0 md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto mb-8 mt-0 hidden h-1 w-24 rounded-full bg-[var(--color-accent-strong)] md:block" />

        <div className="space-y-4">
          {isEmpty && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-4"
                >
                  <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-gray-200" />
                    <div className="h-3.5 w-5/6 rounded bg-gray-200" />
                    <div className="h-3.5 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </>
          )}
          {!isEmpty &&
            faqs.map((item) => (
              <details
                key={item.id}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-page)] p-4 transition-colors open:bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-lg font-medium text-[var(--color-ink)]">
                    {item.question}
                  </span>
                  <span className="ml-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--color-soft)] text-[var(--color-accent-strong)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3 text-[var(--color-muted)]">{item.answer}</div>
              </details>
            ))}
        </div>
      </Container>
    </section>
  );
}
