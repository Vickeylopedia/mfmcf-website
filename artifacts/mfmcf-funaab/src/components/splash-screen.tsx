import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logo } from "@/lib/site";

const SPLASH_SESSION_KEY = "mfmcf_splash_viewed";

export function SplashScreen({ minDuration = 4000 }: { minDuration?: number }) {
  // Only show when the page is opened for the first time in a tab, not on reload
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !sessionStorage.getItem(SPLASH_SESSION_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) return;

    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
    } catch {}

    const timer = setTimeout(() => {
      setVisible(false);
    }, minDuration);

    const handleKeyDown = () => {
      setVisible(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, minDuration]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mfmcf-editorial-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.99,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-white text-[hsl(var(--foreground))] select-none cursor-pointer p-6 sm:p-10 lg:p-14"
          onClick={() => setVisible(false)}
          role="dialog"
          aria-label="Welcome to MFMCF FUNAAB"
        >
          {/* Subtle Corner Ambient Stylization (Far from text area) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-gradient-to-br from-[hsl(var(--accent)/.12)] to-[hsl(var(--primary)/.06)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-gradient-to-tr from-[hsl(var(--primary)/.08)] to-[hsl(var(--accent)/.05)] blur-3xl"
          />

          {/* ── TOP EDITORIAL HEADER BAR ── */}
          <div className="relative z-10 w-full flex items-center justify-between border-b border-[hsl(var(--foreground)/.1)] pb-4">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] font-bold">
              MFMCF · FUNAAB CHAPTER
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--accent))] font-bold">
              EST. 1999
            </span>
          </div>

          {/* ── CENTER EDITORIAL CONTENT ── */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
            {/* Logo in clean editorial presentation */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative size-20 sm:size-24 flex items-center justify-center mb-6"
            >
              <img
                src={logo}
                alt="MFMCF FUNAAB Emblem"
                className="size-full object-contain drop-shadow-sm"
              />
            </motion.div>

            {/* Editorial Hairline Divider */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80px", opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="h-[1.5px] bg-[hsl(var(--primary))] mb-5"
            />

            {/* Main Title: Just "MFMCF FUNAAB" with smaller, sophisticated typography */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.22em] text-[hsl(var(--foreground))]"
            >
              MFMCF FUNAAB
            </motion.h1>

            {/* Sub-label under title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--muted-foreground))]"
            >
              Campus Christian Fellowship
            </motion.p>

            {/* ── ANIMATED THREE DOT LOADER ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="mt-8 flex items-center justify-center gap-2"
              aria-label="Loading..."
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [-4, 4, -4],
                    scale: [0.9, 1.25, 0.9],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                  className="size-2 rounded-full bg-[hsl(var(--primary))]"
                />
              ))}
            </motion.div>
          </div>

          {/* ── BOTTOM EDITORIAL FOOTER: Family of love, word and power ── */}
          <div className="relative z-10 w-full border-t border-[hsl(var(--foreground)/.1)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]"
            >
              Family of love, word and power
            </motion.p>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]"
            >
              Tap anywhere to enter
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
