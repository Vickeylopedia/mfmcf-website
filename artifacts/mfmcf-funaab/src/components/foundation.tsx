import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

/**
 * Design-system foundations. Extracted verbatim from the live screens — see
 * DESIGN_SYSTEM.md. Later className overrides win via tailwind-merge, so a
 * screen can tweak leading/max-width without forking the primitive.
 */

/** Mono eyebrow label. `primary` on light backgrounds, `accent` on dark. */
export function Eyebrow({
  children,
  tone = "primary",
  weight = "regular",
  className,
}: {
  children: ReactNode;
  tone?: "primary" | "accent";
  weight?: "regular" | "bold";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mono-label text-[10px] text-[hsl(var(--primary))]",
        tone === "accent" && "text-[hsl(var(--accent))]",
        weight === "bold" && "font-bold",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Eyebrow + Fraunces display heading, the standard section opener. */
export function SectionHeading({
  eyebrow,
  eyebrowTone = "primary",
  title,
  className,
  headingClassName,
}: {
  eyebrow: string;
  eyebrowTone?: "primary" | "accent";
  title: ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "display-font mt-4 text-5xl tracking-[-.035em] sm:text-6xl",
          headingClassName,
        )}
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
  className,
  ...rest
}: {
  children: ReactNode;
  inverted?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(actionClasses(inverted), className)}
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
  className,
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
      className={cn(actionClasses(inverted), className)}
    >
      {children}
      {actionArrow}
    </Link>
  );
}

/** Photo frame. Bordered hero style by default; `frame="none"` for plain crops. */
export function PhotoFrame({
  src,
  alt,
  frame = "primary",
  shift = true,
  className,
  imgClassName,
  testId,
}: {
  src: string;
  alt: string;
  frame?: "primary" | "foreground" | "none";
  shift?: boolean;
  className?: string;
  imgClassName?: string;
  testId?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        frame !== "none" && `border-8 border-[hsl(var(--${frame}))]`,
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        {...(testId ? { "data-testid": testId } : {})}
        className={cn(
          "h-full w-full object-cover",
          shift && "photo-shift",
          imgClassName,
        )}
      />
    </div>
  );
}
