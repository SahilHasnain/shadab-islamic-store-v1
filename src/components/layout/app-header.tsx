"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Category, SiteSettings } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/layout/container";
import { useCart } from "@/src/features/cart/cart-context";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
];

export function AppHeader({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const [searchDesktop, setSearchDesktop] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const lastY = useRef(0);
  const { itemCount, openCart } = useCart();
  const hasWhatsApp = Boolean(settings.contact.whatsappNumber);
  const isProductsPage = pathname.startsWith("/products");

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 10);
      if (Math.abs(y - lastY.current) > 8) {
        setScrollDir(y > lastY.current ? "down" : "up");
        lastY.current = y;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const onSubmitDesktop = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchDesktop.trim();
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  const onSubmitMobile = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchMobile.trim();
    if (!q) return;
    setMobileOpen(false);
    router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color,transform] duration-300",
        mobileOpen
          ? "border-gray-200 bg-white shadow-md"
          : isScrolled
            ? "border-gray-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70"
            : "border-transparent bg-transparent",
        !isProductsPage && scrollDir === "down" && !mobileOpen
          ? "translate-y-[-60%] md:translate-y-[-70%]"
          : "",
      )}
      role="banner"
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-all",
            !isProductsPage && scrollDir === "down" && !mobileOpen
              ? "h-10 md:h-12"
              : "h-16",
          )}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={settings.logoPath}
              alt={`${settings.businessName} logo`}
              width={36}
              height={36}
              className="rounded-full border border-gray-200"
            />
            <span className="inline font-semibold text-[var(--color-accent-strong)] line-clamp-2 md:hidden lg:inline">
              {settings.businessName}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop: Search + Nav */}
            <div className="hidden items-center gap-3 md:flex">
              <form onSubmit={onSubmitDesktop} className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchDesktop}
                  onChange={(e) => setSearchDesktop(e.target.value)}
                  className="h-10 w-60 rounded-full border border-gray-200 bg-white/70 px-4 pr-9 text-sm shadow-sm backdrop-blur focus:outline-none focus:ring-2 ring-[var(--color-accent)]/30"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 4.215 12.03l4.252 4.253a.75.75 0 1 0 1.06-1.06l-4.252-4.254A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
              {navigation.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-full border px-3 text-sm font-medium shadow-sm",
                      isActive
                        ? "border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] text-white"
                        : "border-gray-200 bg-white/70 backdrop-blur hover:border-[var(--color-accent)]/60",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              aria-label={itemCount ? `Open cart (${itemCount} items)` : "Open cart"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/70 shadow-sm backdrop-blur-sm hover:border-[var(--color-accent)]/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-[var(--color-accent-strong)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h11.218c.51 0 .955-.343 1.087-.835l2.048-7.68a.563.563 0 0 0-.547-.685H5.108M7.5 14.25 5.106 5.272M7.5 14.25l-.97 3.64A1.125 1.125 0 0 0 7.617 19.5h10.716"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent-strong)] px-1 text-[11px] font-semibold text-white shadow">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/70 shadow-sm backdrop-blur-sm md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3.75 5.25A.75.75 0 0 1 4.5 4.5h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 7A.75.75 0 0 1 4.5 11.5h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 7a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={settings.logoPath}
                  alt="logo"
                  width={28}
                  height={28}
                  className="rounded-full border"
                />
                <span className="font-semibold text-[var(--color-accent-strong)]">
                  {settings.businessName}
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={onSubmitMobile} className="mt-2">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                  className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 ring-[var(--color-accent)]/30"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 1 0 4.215 12.03l4.252 4.253a.75.75 0 1 0 1.06-1.06l-4.252-4.254A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Nav */}
            <nav className="mt-4 grid gap-2">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 font-medium",
                      isActive
                        ? "bg-[var(--color-accent-strong)] text-white shadow"
                        : "hover:bg-[var(--color-soft)]/60",
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Categories */}
            <div className="mt-4 grid gap-2">
              <div className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Categories
              </div>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-[var(--color-soft)]/60"
                >
                  {category.title}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            {(settings.contact.instagramHandle || hasWhatsApp) && (
              <>
                <hr className="my-4" />
                <div className="flex items-center gap-3 px-1">
                  {settings.contact.instagramHandle && (
                    <a
                      href={`https://instagram.com/${settings.contact.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <svg
                        className="h-5 w-5 text-[var(--color-accent-strong)]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                  {hasWhatsApp && (
                    <a
                      href={`https://wa.me/${settings.contact.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <svg
                        className="h-5 w-5 text-[var(--color-accent-strong)]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
