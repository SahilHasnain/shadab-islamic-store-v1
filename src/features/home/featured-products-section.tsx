import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/layout/container";
import { getDiscountPercentage, getDisplayPrice } from "@/src/features/home/format";
import { SectionHeading } from "@/src/features/home/section-heading";
import type { Product } from "@/src/types";

export function FeaturedProductsSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section id="featured-products" className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Featured Products"
          title={title}
          description="The homepage now carries the same bright storefront energy as the original app, but the implementation remains cleanly separated from data shaping and catalog logic."
          action={
            <Button href="/products" variant="secondary">
              Browse full catalog
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const price = getDisplayPrice(product);
            const discountPercentage = getDiscountPercentage(product);

            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {discountPercentage ? (
                      <span className="rounded-full bg-[var(--color-highlight)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                        {discountPercentage}% off
                      </span>
                    ) : null}
                    {!product.inStock ? (
                      <span className="rounded-full bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                        Out of stock
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      {product.categorySlug}
                    </p>
                    <h3 className="font-display text-3xl leading-tight text-[var(--color-ink)]">
                      {product.name}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      {product.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      {price.original !== price.final ? (
                        <p className="text-sm text-[var(--color-muted)] line-through">
                          {price.original}
                        </p>
                      ) : null}
                      <p className="font-display text-3xl text-[var(--color-ink)]">
                        {price.final}
                      </p>
                    </div>
                    <Button href="/products" className="px-4 py-2.5">
                      View details
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
