interface AvatarProps {
  name: string;
  size?: number;
}

/** Deterministic initials avatar — a lightweight stand-in for a business logo. */
export function Avatar({ name, size = 44 }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      style={{
        flex: "0 0 auto",
        width: size,
        height: size,
        borderRadius: 999,
        background: "var(--brand-tint)",
        color: "var(--brand)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </span>
  );
}
