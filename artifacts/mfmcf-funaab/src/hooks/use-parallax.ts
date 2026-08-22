import { useEffect, useRef } from "react";

/**
 * Gentle scroll parallax: translates the element upward as the page scrolls
 * past it (progress capped so it never drifts out of composition).
 * Transform-only and rAF-throttled; a no-op for reduced-motion users.
 */
export function useParallax(cap = 64) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top, 0), 1200) / 1200;
      el.style.transform = `translateY(${(-progress * cap).toFixed(1)}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cap]);

  return ref;
}
