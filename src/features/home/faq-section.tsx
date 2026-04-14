import { Container } from "@/src/components/layout/container";
import { SectionHeading } from "@/src/features/home/section-heading";
import type { FAQItem } from "@/src/types";

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Everything you need to know before placing an order."
          description="A few common questions about browsing, ordering, and product availability."
        />
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <article
              key={faq.id}
              className="rounded-[1.75rem] border border-[var(--color-border)] bg-white px-6 py-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="font-display text-2xl text-[var(--color-ink)]">
                {faq.question}
              </h3>
              <p className="mt-3 text-base leading-8 text-[var(--color-muted)]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
