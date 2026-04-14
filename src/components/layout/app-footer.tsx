import Link from "next/link";
import type { SiteSettings } from "@/src/types";
import { buildWhatsAppUrl } from "@/src/lib/utils";
import { Container } from "@/src/components/layout/container";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
  { href: "/#phase-plan", label: "Plan" },
];

export function AppFooter({ settings }: { settings: SiteSettings }) {
  const hasWhatsApp = Boolean(settings.contact.whatsappNumber);

  return (
    <footer className="border-t border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(220,252,231,0.72))] py-16">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <p className="font-display text-3xl text-[var(--color-accent-strong)]">
            {settings.businessName}
          </p>
          <p className="max-w-md text-sm leading-7 text-[var(--color-muted)]">
            {settings.description}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Navigation
          </p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-strong)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Connect
          </p>
          <div className="mt-4 grid gap-3 text-sm">
            {hasWhatsApp ? (
              <a
                href={buildWhatsAppUrl(
                  settings.contact.whatsappNumber,
                  settings.contact.whatsappMessage,
                )}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-strong)]"
              >
                WhatsApp
              </a>
            ) : null}
            {settings.contact.instagramHandle ? (
              <a
                href={`https://instagram.com/${settings.contact.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-strong)]"
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>
      </Container>

      <Container className="mt-10 border-t border-[var(--color-border)] pt-6">
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
