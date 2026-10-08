import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editorial lower-third marquee: a broadcast-style news ticker that scrolls
 * continuously from right to left across the screen.
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
    accent: "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] border-[hsl(var(--foreground))]",
    primary: "bg-[hsl(var(--primary))] text-white border-white/20",
    foreground: "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] border-[hsl(var(--accent))]",
  };

  const tickerContent = items.concat(items).concat(items);

  const strip = (
    <div className="flex shrink-0 items-center">
      {tickerContent.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span className="mono-label px-5 text-[11px] font-bold tracking-[.18em] uppercase sm:px-8 sm:text-xs">
            {item}
          </span>
          <Asterisk className="size-3.5 opacity-70" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden border-y-2 py-3 shadow-[0_2px_0px_rgba(0,0,0,0.06)]",
        tones[tone],
        className
      )}
      role="region"
      aria-label="Campus news ticker"
    >
      {/* Lower third broadcast badge */}
      <div className="relative z-10 flex shrink-0 items-center gap-2.5 border-r-2 border-current bg-inherit px-4 py-0.5 sm:px-6">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-red-600" />
        </span>
        <span className="mono-label text-[10px] font-black tracking-widest sm:text-xs">
          BULLETIN
        </span>
      </div>

      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 26,
            repeat: Infinity,
          }}
        >
          {strip}
          {strip}
        </motion.div>
      </div>
    </div>
  );
}
