import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "up" | "left" | "right" | "scale";

/**
 * Scroll reveal: the element stays hidden until it enters the viewport, then
 * transitions in once (see .reveal-item in index.css). Variants map to intent
 * — headings rise, split-grid columns drift in from their side, photos settle
 * at scale, list items stagger via `delay`.
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
  /** Stagger in ms; keep under ~300 so a section settles in one motion. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-item",
        `reveal-${variant}`,
        visible && "is-visible",
        className,
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
