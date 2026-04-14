"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Category, SiteSettings } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/layout/container";
import { useCart } from "@/src/features/cart/cart-context";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
];

export function AppHeader({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[rgba(255,255,255,0.82)] backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_8px_24px_rgba(22,163,74,0.18)]">
              <Image
                src={settings.logoPath}
                alt={settings.businessName}
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <p className="font-display text-2xl leading-none text-[var(--color-accent-strong)]">
                {settings.businessName}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Official Storefront
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navigation.map((item) => {
              const isActive =
                item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-[var(--color-accent)] text-white shadow-[0_10px_24px_rgba(22,163,74,0.22)]"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-soft)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-accent-strong)] shadow-[0_8px_20px_rgba(22,163,74,0.12)]"
              aria-label={itemCount ? `Open cart with ${itemCount} items` : "Open cart"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h11.218c.51 0 .955-.343 1.087-.835l2.048-7.68a.563.563 0 0 0-.547-.685H5.108M7.5 14.25 5.106 5.272M7.5 14.25l-.97 3.64A1.125 1.125 0 0 0 7.617 19.5h10.716"
                />
              </svg>
              {itemCount ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
            <Button href="/products" variant="secondary">
              Browse Catalog
            </Button>
            <Button
              href={`https://wa.me/${settings.contact.whatsappNumber}`}
              className="shadow-none"
            >
              WhatsApp
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white shadow-[0_8px_20px_rgba(22,163,74,0.12)] lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-5 bg-[var(--color-ink)]" />
              <span className="block h-0.5 w-5 bg-[var(--color-ink)]" />
              <span className="block h-0.5 w-5 bg-[var(--color-ink)]" />
            </span>
          </button>
        </div>

        <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-soft)] hover:text-[var(--color-accent-strong)]"
            >
              {category.title}
            </Link>
          ))}
        </div>

        {mobileOpen ? (
          <div className="mt-4 grid gap-4 rounded-[1.75rem] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-panel)] lg:hidden">
            <nav className="grid gap-2">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold",
                      isActive
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[var(--color-soft)] text-[var(--color-ink)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  openCart();
                  setMobileOpen(false);
                }}
                className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-left text-sm font-semibold text-[var(--color-ink)]"
              >
                Cart {itemCount ? `(${itemCount})` : ""}
              </button>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted)]"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
