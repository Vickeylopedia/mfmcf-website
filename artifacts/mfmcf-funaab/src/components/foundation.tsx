import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

/**
 * Design-system foundations. Extracted verbatim from the live screens — see
 * DESIGN_SYSTEM.md. Screens still compose their own classes; these primitives
 * exist so the apply pass can swap them in without visual change.
 */

/** Mono eyebrow label. `primary` on light backgrounds, `accent` on dark. */
export function Eyebrow({
  children,
  tone = "primary",
  className = "",
}: {
  children: ReactNode;
  tone?: "primary" | "accent";
  className?: string;
}) {
  return (
    <p
      className={`mono-label text-[10px] font-bold text-[hsl(var(--${tone}))] ${className}`}
    >
      {children}
    </p>
  );
}

/** Eyebrow + Fraunces display heading, the standard section opener. */
export function SectionHeading({
  eyebrow,
  title,
  tone = "primary",
  size = "section",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  tone?: "primary" | "accent";
  size?: "section" | "cinema";
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`display-font mt-4 tracking-[-.035em] ${
          size === "cinema"
            ? "max-w-xl text-5xl leading-[.92] tracking-[-.04em] sm:text-7xl"
            : "mt-5 max-w-md text-5xl leading-[.96] sm:text-6xl"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

const actionClasses = (inverted: boolean) =>
  `group inline-flex items-center gap-3 border px-5 py-3 text-sm font-semibold transition-colors ${
    inverted
      ? "border-white/35 text-white hover:bg-white hover:text-[hsl(var(--primary))]"
      : "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white hover:bg-transparent hover:text-[hsl(var(--primary))]"
  }`;

const actionArrow = (
  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
);

/** Primary action button with the arrow affordance. */
export function ActionButton({
  children,
  inverted = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  inverted?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`${actionClasses(inverted)} ${className}`}
      {...rest}
    >
      {children}
      {actionArrow}
    </button>
  );
}

/** Internal-link twin of ActionButton. */
export function ActionLink({
  href,
  children,
  inverted = false,
  className = "",
  testId,
}: {
  href: string;
  children: ReactNode;
  inverted?: boolean;
  className?: string;
  testId?: string;
}) {
  return (
    <Link
      href={href}
      {...(testId ? { "data-testid": testId } : {})}
      className={`${actionClasses(inverted)} ${className}`}
    >
      {children}
      {actionArrow}
    </Link>
  );
}

/** Bordered photo frame with the signature hover scale. */
export function PhotoFrame({
  src,
  alt,
  className = "",
  imgClassName = "",
  shift = true,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  shift?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden border-8 border-[hsl(var(--primary))] bg-white/10 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${shift ? "photo-shift" : ""} ${imgClassName}`}
      />
    </div>
  );
}
