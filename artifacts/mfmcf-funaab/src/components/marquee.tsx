import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editorial marquee band: one long strip of mono labels scrolling slowly.
 * The track repeats its content so the loop is seamless; reduced-motion
 * users see a static strip.
 */
export function Marquee({
  items,
  tone = "accent",
  className,
}: {
  items: string[];
  tone?: "accent" | "primary" | "foreground";
  className?: string;
}) {
  const tones = {
    accent: "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]",
    primary: "bg-[hsl(var(--primary))] text-white",
    foreground: "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]",
  };

  const strip = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="mono-label px-6 text-[11px] sm:px-8 sm:text-xs">
            {item}
          </span>
          <Asterisk className="size-4 opacity-70" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("overflow-hidden border-y py-3.5", tones[tone], className)}
      role="presentation"
    >
      <div className="marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
