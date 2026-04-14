import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/layout/container";
import { SectionHeading } from "@/src/features/home/section-heading";
import { buildWhatsAppUrl } from "@/src/lib/utils";
import type { SiteSettings } from "@/src/types";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-ink)] p-8 text-[var(--color-surface)] shadow-[0_26px_80px_rgba(15,23,42,0.18)]">
          <SectionHeading
            eyebrow="Ready To Order"
            title="WhatsApp remains the primary conversion path."
            description="That behavior was already right in the source app. The rebuild keeps it front and center while making the supporting code easier to extend later."
            tone="inverse"
          />
          <div className="mt-8">
            <Button
              href={buildWhatsAppUrl(
                settings.contact.whatsappNumber,
                settings.contact.whatsappMessage,
              )}
              variant="secondary"
              className="border-white/20 bg-white text-[var(--color-ink)] hover:border-white"
            >
              Order on WhatsApp
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <div className="overflow-hidden rounded-[2rem]">
            <iframe
              title={`${settings.businessName} map`}
              src={settings.mapEmbedUrl}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="min-h-[26rem] border-0"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
