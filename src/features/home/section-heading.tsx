import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      className={cn(
        "flex gap-6",
        align === "center"
          ? "flex-col items-center text-center"
          : "flex-col justify-between lg:flex-row lg:items-end",
      )}
    >
      <div className={cn("space-y-4", align === "center" ? "max-w-3xl" : "max-w-2xl")}>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.24em]",
            tone === "inverse"
              ? "text-[var(--color-cream)]/70"
              : "text-[var(--color-accent)]",
          )}
        >
          {eyebrow}
        </p>
        <h2
          className={cn(
            "font-display text-4xl leading-none tracking-[-0.03em] md:text-5xl",
            tone === "inverse" ? "text-[var(--color-surface)]" : "text-[var(--color-ink)]",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-base leading-8 md:text-lg",
              tone === "inverse"
                ? "text-[var(--color-cream)]/80"
                : "text-[var(--color-muted)]",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
