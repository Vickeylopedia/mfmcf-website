import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logo } from "@/lib/site";

export function SplashScreen({ minDuration = 2200 }: { minDuration?: number }) {
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
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0c241c] via-[#071712] to-[#030907] text-white select-none cursor-pointer"
          onClick={() => setVisible(false)}
          role="dialog"
          aria-label="Welcome to MFMCF FUNAAB"
        >
          {/* Rich Radial Editorial Gradients & Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(var(--accent)/.22),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 -top-28 size-[32rem] rounded-full bg-[hsl(var(--primary)/.3)] blur-[140px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-28 size-[30rem] rounded-full bg-[hsl(var(--accent)/.2)] blur-[150px]"
          />

          {/* Editorial Framing Border & Subtle Corner Crosses */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 sm:inset-8 border border-white/10"
          >
            <div className="absolute left-3 top-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-white/40 sm:left-4 sm:top-4">
              MFMCF · FUNAAB
            </div>
            <div className="absolute right-3 top-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-[hsl(var(--accent))] sm:right-4 sm:top-4">
              FAMILY OF LOVE
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-white/40 sm:bottom-4 sm:left-4">
              CAMPUS FELLOWSHIP
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-white/40 sm:bottom-4 sm:right-4">
              WELCOME
            </div>
          </div>

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.72, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative size-28 sm:size-36 flex items-center justify-center"
            >
              {/* Backlight Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.35, 0.7, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-[hsl(var(--accent))] blur-2xl -z-10"
              />
              <img
                src={logo}
                alt="MFMCF FUNAAB Logo"
                className="size-full object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.75)]"
              />
            </motion.div>

            {/* Typography Section Underneath Logo */}
            <div className="mt-7">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.12)] px-3.5 py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--accent))]"
              >
                Mountain of Fire &amp; Miracles Ministries
              </motion.div>

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
                      delay: 0.45 + idx * 0.04,
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
                transition={{ delay: 0.95, duration: 0.6, ease: "easeOut" }}
                className="mt-2.5 font-mono text-[9px] sm:text-xs uppercase tracking-[0.28em] text-white/60"
              >
                Family of Love · Campus Fellowship
              </motion.p>
            </div>

            {/* ── THREE DOT ANIMATED LOADER (Non-Circle) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              className="mt-9 flex items-center justify-center gap-2.5"
              aria-label="Loading..."
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [-5, 5, -5],
                    scale: [0.85, 1.35, 0.85],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="size-2.5 sm:size-3 rounded-full bg-gradient-to-tr from-[hsl(var(--accent))] via-[#fce6a2] to-[hsl(var(--accent))] shadow-[0_0_12px_hsl(var(--accent)/0.9)]"
                />
              ))}
            </motion.div>

            {/* Dismiss Hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-6 font-mono text-[9px] uppercase tracking-widest text-white/40"
            >
              Tap anywhere to enter
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

