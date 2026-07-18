import type { ReactNode } from "react";

type BadgeVariant = "ok" | "warn" | "alert" | "neutral" | "verified";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

/** Small status pill with a leading dot. */
export function Badge({ variant, children }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
