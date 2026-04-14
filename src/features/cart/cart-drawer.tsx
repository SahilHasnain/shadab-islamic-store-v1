"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { mockSettings } from "@/src/data/mock";
import { formatPrice } from "@/src/features/home/format";
import { buildWhatsAppUrl, cn } from "@/src/lib/utils";
import { useCart } from "@/src/features/cart/cart-context";

export function CartDrawer() {
  const { items, open, closeCart, updateQuantity, removeItem, clear, subtotal } =
    useCart();

  const message =
    items.length === 0
      ? mockSettings.contact.whatsappMessage
      : `${mockSettings.contact.whatsappMessage}\n\n${items
          .map((item, index) => {
            const selections = item.selections.length
              ? ` [${item.selections.map((entry) => `${entry.group}: ${entry.value}`).join(", ")}]`
              : "";
            return `${index + 1}. ${item.name}${selections} x${item.quantity} - ${formatPrice(
              item.unitPrice,
            )}`;
          })
          .join("\n")}\n\nTotal: ${formatPrice(subtotal)}`;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 transition",
        open ? "visible" : "invisible",
      )}
    >
      <button
        type="button"
        onClick={closeCart}
        aria-label="Close cart drawer"
        className={cn(
          "absolute inset-0 bg-[rgba(15,23,42,0.56)] transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0",
        )}
      />

      <aside
        className={cn(
          "pointer-events-auto absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(15,23,42,0.25)] transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Cart
            </p>
            <h2 className="font-display text-3xl text-[var(--color-ink)]">
              Your selections
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-xl text-[var(--color-ink)]"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 text-center">
              <p className="font-display text-3xl text-[var(--color-ink)]">Cart is empty.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Add products from the catalog or product modal to complete the storefront flow.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[2rem] border border-[var(--color-border)] bg-white p-4 sm:grid-cols-[6rem_1fr]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl leading-tight text-[var(--color-ink)]">
                        {item.name}
                      </h3>
                      {item.selections.length ? (
                        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                          {item.selections
                            .map((selection) => `${selection.group}: ${selection.value}`)
                            .join(" • ")}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-[var(--color-accent-strong)]"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-[var(--color-ink)]">
                      {formatPrice(item.unitPrice)}
                    </p>
                    <div className="flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 text-lg text-[var(--color-ink)]"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center text-sm font-semibold text-[var(--color-ink)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 text-lg text-[var(--color-ink)]"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-4 border-t border-[var(--color-border)] px-6 py-5">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
            <span>Subtotal</span>
            <span className="font-semibold text-[var(--color-ink)]">
              {items.length ? formatPrice(subtotal) : "—"}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              href={items.length ? buildWhatsAppUrl(mockSettings.contact.whatsappNumber, message) : "#"}
              className={cn("flex-1", items.length ? "" : "pointer-events-none opacity-50")}
            >
              Order on WhatsApp
            </Button>
            <Button variant="secondary" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
