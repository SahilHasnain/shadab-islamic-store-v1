import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  onClick?: never;
}

interface ActionButtonProps extends BaseButtonProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

type ButtonProps = LinkButtonProps | ActionButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-[0_18px_40px_rgba(185,92,46,0.22)] hover:bg-[var(--color-accent-strong)]",
  secondary:
    "border border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]",
  ghost:
    "text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.55)]",
};

const sharedClassName =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const resolvedClassName = cn(sharedClassName, variantClasses[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={resolvedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      className={resolvedClassName}
    >
      {children}
    </button>
  );
}
