import { motion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "up" | "left" | "right" | "scale";

/**
 * Scroll reveal: animates elements smoothly into view both when scrolling
 * downward and upward across the site.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  /** Stagger in ms */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const variants: Record<RevealVariant, Variants> = {
    up: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: -36 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: 36 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.94, y: 16 },
      visible: { opacity: 1, scale: 1, y: 0 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.05, margin: "0px 0px -30px 0px" }}
      variants={variants[variant]}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={cn(className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
