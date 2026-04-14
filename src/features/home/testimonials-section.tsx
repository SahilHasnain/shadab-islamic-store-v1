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
          description="Real buyer confidence comes from clarity, trust, and a simple ordering experience."
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)]"
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
                <p className="text-sm font-semibold text-[var(--color-highlight)]">
                  {Array.from({ length: testimonial.rating ?? 5 }, () => "★").join("")}
                </p>
              </div>
              <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
                &ldquo;{testimonial.text}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
