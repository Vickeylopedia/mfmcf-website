import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logo } from "@/lib/site";

export function SplashScreen({ minDuration = 4000 }: { minDuration?: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

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

  const titleWords = [
    { text: "M", accent: false },
    { text: "F", accent: false },
    { text: "M", accent: false },
    { text: "C", accent: false },
    { text: "F", accent: false },
    { text: " ", accent: false },
    { text: "F", accent: true },
    { text: "U", accent: true },
    { text: "N", accent: true },
    { text: "A", accent: true },
    { text: "A", accent: true },
    { text: "B", accent: true },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mfmcf-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#24103a] via-[#160826] to-[#0c0414] text-white select-none cursor-pointer"
          onClick={() => setVisible(false)}
          role="dialog"
          aria-label="Welcome to MFMCF FUNAAB"
        >
          {/* Website Royal Purple & Gold Radial Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(168,85,247,0.25),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 -top-28 size-[34rem] rounded-full bg-[hsl(var(--primary)/.35)] blur-[140px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-28 size-[32rem] rounded-full bg-[hsl(var(--accent)/.22)] blur-[150px]"
          />

          {/* Editorial Framing Border & Subtle Corner Accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 sm:inset-8 border border-white/10"
          >
            <div className="absolute left-3 top-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-white/50 sm:left-4 sm:top-4">
              MFMCF · FUNAAB
            </div>
            <div className="absolute right-3 top-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-[hsl(var(--accent))] sm:right-4 sm:top-4">
              FAMILY OF LOVE
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-white/50 sm:bottom-4 sm:left-4">
              CAMPUS FELLOWSHIP
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-white/50 sm:bottom-4 sm:right-4">
              WELCOME
            </div>
          </div>

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Logo Container with Luminous Contrast Backdrop */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative size-32 sm:size-40 flex items-center justify-center"
            >
              {/* Luminous Light Halo directly behind the purple logo for maximum contrast */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.92, 1, 0.92],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -m-3 sm:-m-5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.96)_0%,rgba(255,250,240,0.88)_40%,rgba(253,240,215,0.45)_68%,transparent_100%)] shadow-[0_0_70px_rgba(255,255,255,0.85),0_0_110px_hsl(var(--accent)/0.5)] -z-10"
              />

              <img
                src={logo}
                alt="MFMCF FUNAAB Logo"
                className="size-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
              />
            </motion.div>

            {/* Typography Section Underneath Logo */}
            <div className="mt-8">
              {/* Mountain of Fire & Miracles Ministries - Pure White, No Box */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.26em] text-white drop-shadow-sm"
              >
                Mountain of Fire &amp; Miracles Ministries
              </motion.p>

              {/* Animated "MFMCF FUNAAB" title */}
              <motion.h1
                className="display-font mt-3 text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[0.95] flex items-center justify-center gap-0.5"
                aria-label="MFMCF FUNAAB"
              >
                {titleWords.map((item, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.5 + idx * 0.04,
                      duration: 0.5,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className={item.accent ? "italic text-[hsl(var(--accent))]" : "text-white"}
                  >
                    {item.text === " " ? "\u00A0" : item.text}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
                className="mt-2.5 font-mono text-[9px] sm:text-xs uppercase tracking-[0.28em] text-white/70"
              >
                Family of Love · Campus Fellowship
              </motion.p>
            </div>

            {/* ── THREE DOT ANIMATED LOADER (Non-Circle) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="mt-10 flex items-center justify-center gap-3"
              aria-label="Loading..."
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [-6, 6, -6],
                    scale: [0.85, 1.35, 0.85],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.15,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="size-2.5 sm:size-3 rounded-full bg-gradient-to-tr from-[hsl(var(--accent))] via-[#fce6a2] to-[hsl(var(--accent))] shadow-[0_0_14px_hsl(var(--accent)/0.95)]"
                />
              ))}
            </motion.div>

            {/* Dismiss Hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-6 font-mono text-[9px] uppercase tracking-widest text-white/50"
            >
              Tap anywhere to enter
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


