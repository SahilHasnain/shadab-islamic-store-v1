import { Container } from "@/src/components/layout/container";
import { SectionHeading } from "@/src/features/home/section-heading";
import type { Testimonial } from "@/src/types";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Testimonials"
          title="Confidence matters more than feature count in this storefront."
          description="The original app already signaled trust through simple social proof. The rebuild keeps that idea, but the section now lives in an isolated home feature."
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-[0_18px_48px_rgba(148,163,184,0.18)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-3xl text-[var(--color-ink)]">
                    {testimonial.name}
                  </p>
                  {testimonial.role ? (
                    <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      {testimonial.role}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm font-semibold text-[var(--color-accent)]">
                  {Array.from({ length: testimonial.rating ?? 5 }, () => "★").join("")}
                </p>
              </div>
              <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
                “{testimonial.text}”
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
