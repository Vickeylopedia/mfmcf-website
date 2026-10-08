import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useParallax } from "@/hooks/use-parallax";
import { useDocumentTitle } from "@/hooks/use-document-title";
import {
  ArrowDownRight,
  ArrowUpRight,
  Asterisk,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Play,
  Quote,
  Send,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Shell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import {
  ActionLink,
  Eyebrow,
  PhotoFrame,
  SectionHeading,
} from "@/components/foundation";
import { getSermon } from "@/lib/sermons";
import { useSermons, type SermonView } from "@/lib/queries";
import { photos } from "@/lib/site";

const TYPEWRITER_PHRASES = [
  {
    line1: "MFMCF",
    line2: "FUNAAB",
    badge: "FELLOWSHIP ON CAMPUS",
  },
  {
    line1: "Sincerely we",
    line2: "Love you",
    badge: "FROM OUR HEARTS",
  },
];

function LoopingTypewriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = TYPEWRITER_PHRASES[phraseIdx];
  const line1Length = currentPhrase.line1.length;
  const line2Length = currentPhrase.line2.length;
  const totalLength = line1Length + line2Length;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIdx < totalLength) {
        // Deliberate, rhythmic typing speed (135ms/char)
        timeout = setTimeout(() => {
          setCharIdx((prev) => prev + 1);
        }, 135);
      } else {
        // Paused at full phrase: 2000ms pause so the text can be comfortably read
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (charIdx > 0) {
        // Controlled, natural backspacing speed (65ms/char)
        timeout = setTimeout(() => {
          setCharIdx((prev) => prev - 1);
        }, 65);
      } else {
        // Finished deleting: 500ms pause before starting the next phrase
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx, totalLength]);

  const currentLine1 = currentPhrase.line1.slice(0, Math.min(charIdx, line1Length));
  const currentLine2 =
    charIdx > line1Length
      ? currentPhrase.line2.slice(0, charIdx - line1Length)
      : "";

  const isCursorOnLine1 = charIdx <= line1Length;

  const cursor = (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0, 1] }}
      transition={{
        repeat: Infinity,
        duration: 0.75,
        times: [0, 0.49, 0.5, 0.99, 1],
        ease: "linear",
      }}
      className="ml-1.5 inline-block h-[0.78em] w-[3px] sm:w-[5px] align-baseline bg-[hsl(var(--accent))] shadow-[0_0_12px_hsl(var(--accent)/.9)]"
      aria-hidden="true"
    />
  );

  return (
    <div className="mt-6 min-h-[170px] sm:min-h-[220px] lg:min-h-[280px]">
      {/* Editorial badge indicator */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 border border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent)/.15)] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[hsl(var(--accent))]">
          <span className="size-1.5 rounded-full bg-[hsl(var(--accent))] animate-ping" />
          {currentPhrase.badge}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/45">
          {isDeleting ? "⌫ BACKSPACING..." : "⌨ TYPING..."}
        </span>
      </div>

      <h1
        className="display-font text-[2.75rem] leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[7.2rem] select-none"
        aria-label="MFMCF FUNAAB — Sincerely we Love you"
      >
        {/* Line 1 */}
        <span className="block text-white">
          <span className="relative inline-block">
            {currentLine1}
            {phraseIdx === 0 && (
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentLine1.length >= line1Length ? 1 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ originX: 0 }}
                className="absolute -bottom-[.06em] -left-[2%] -z-10 h-[.16em] w-[104%] bg-[hsl(var(--accent)/.75)]"
              />
            )}
          </span>
          {isCursorOnLine1 && cursor}
        </span>

        {/* Line 2 (always on a separate line on both mobile & desktop) */}
        <span className="block mt-1 sm:mt-2">
          {phraseIdx === 0 ? (
            <em className="font-normal text-[hsl(var(--accent))]">
              {currentLine2}
            </em>
          ) : (
            <em className="font-normal text-[hsl(var(--accent))] underline decoration-[hsl(var(--accent)/.4)] decoration-wavy underline-offset-8">
              {currentLine2}
            </em>
          )}
          {!isCursorOnLine1 && cursor}
        </span>
      </h1>
    </div>
  );
}

const SOUNDWAVE_HEIGHTS = [
  24, 42, 68, 92, 54, 38, 76, 100, 62, 44, 86, 52, 32, 70, 94, 58, 28, 64,
  82, 46, 74, 98, 60, 36, 80, 50, 30, 66, 88, 54, 38, 72, 90, 48, 62, 34,
  56, 84, 40, 68,
];

function SmoothSoundwaves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-20 sm:h-28 items-end justify-between gap-1 px-4 sm:px-10 opacity-85 overflow-hidden"
    >
      {SOUNDWAVE_HEIGHTS.map((height, i) => {
        const isGold = i % 3 === 0;
        const isTall = height > 65;

        return (
          <motion.span
            key={i}
            className={`origin-bottom rounded-t-sm ${
              isGold
                ? "bg-[hsl(var(--accent))] w-1 sm:w-1.5 shadow-[0_0_8px_hsl(var(--accent)/.4)]"
                : "bg-white/40 w-0.5 sm:w-1"
            }`}
            style={{ height: `${height * 0.75}%` }}
            animate={{
              scaleY: isTall ? [0.35, 1.3, 0.55, 1.1, 0.35] : [0.3, 1.15, 0.5, 0.95, 0.3],
              opacity: isGold ? [0.65, 1, 0.7, 1, 0.65] : [0.25, 0.65, 0.35, 0.75, 0.25],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.2 + (i % 6) * 0.24,
              delay: (i % 9) * 0.08,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

function EditorialSeal() {
  return (
    <motion.div
      aria-hidden="true"
      whileHover={{ scale: 1.1, rotate: 8 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="pointer-events-auto absolute -right-3 -top-3 z-30 hidden size-32 select-none md:block lg:-right-6 lg:-top-5 lg:size-36 cursor-pointer"
      title="MFMCF FUNAAB Chapel Archive Seal"
    >
      <motion.svg
        viewBox="0 0 160 160"
        className="size-full text-[hsl(var(--accent))]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        <defs>
          <path
            id="sealPath"
            d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
          />
        </defs>
        {/* Outer dashed ring */}
        <circle
          cx="80"
          cy="80"
          r="74"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        {/* Inner ring */}
        <circle
          cx="80"
          cy="80"
          r="66"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
        />
        {/* Circular text */}
        <text
          fill="currentColor"
          className="font-mono text-[8.5px] font-bold uppercase tracking-[0.22em]"
        >
          <textPath href="#sealPath" startOffset="0%">
            ★ MFMCF FUNAAB ★ CHAPEL ARCHIVE · FAMILY OF LOVE ·
          </textPath>
        </text>
        {/* Center emblem */}
        <circle
          cx="80"
          cy="80"
          r="34"
          fill="hsl(var(--foreground))"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g transform="translate(80, 80) scale(0.9)">
          <path
            d="M 0 -18 L 4 -6 L 16 -6 L 7 2 L 11 14 L 0 7 L -11 14 L -7 2 L -16 -6 L -4 -6 Z"
            fill="currentColor"
          />
          <circle cx="0" cy="0" r="3" fill="hsl(var(--foreground))" />
        </g>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none">
        <span className="font-mono text-[8px] font-bold tracking-widest text-white/90">
          EST. 1999
        </span>
      </div>
    </motion.div>
  );
}

function HandDrawnAnnotation() {
  return (
    <div
      aria-hidden="true"
      className="hidden sm:flex items-center gap-2 mt-4 select-none"
    >
      <svg
        className="w-12 h-9 text-[hsl(var(--accent))] shrink-0"
        viewBox="0 0 52 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 6,6 C 26,4 42,12 40,26" strokeDasharray="4 2" />
        <path d="M 32,22 L 40,27 L 46,18" />
      </svg>
      <span className="inline-block -rotate-2 border border-[hsl(var(--accent)/.45)] bg-[hsl(var(--foreground))] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))] shadow-[3px_3px_0px_hsl(var(--accent)/.8)]">
        doors open to all students ⤵
      </span>
    </div>
  );
}

function HeroEditorialMarks() {
  return (
    <>
      {/* Top-left registration mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-5 z-20 hidden items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/40 sm:flex"
      >
        <span className="size-2 rounded-full border border-white/40" />
        <span>REG: 07°18&apos;N // 03°44&apos;E · MFMCF-FUNAAB</span>
      </div>
      {/* Top-right edition mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-5 z-20 hidden items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 lg:flex"
      >
        <span className="border border-white/20 px-2 py-0.5">
          VOL. 2026 // CHAPEL ISSUE 04
        </span>
        <span className="text-[hsl(var(--accent))]">⊕ PRESS READY</span>
      </div>
      {/* Sketched doodle star in background */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 180, 270, 360] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        className="pointer-events-none absolute left-[38%] top-[12%] z-0 hidden lg:block opacity-40 text-[hsl(var(--accent))]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
      </motion.div>
    </>
  );
}

function Home() {
  useDocumentTitle();
  const heroCollage = useParallax(72);
  const { sermons } = useSermons();
  return (
    <Shell>
      <section className="home-hero grain relative overflow-hidden bg-[hsl(var(--primary))] px-5 pb-16 pt-28 text-white lg:px-10 lg:pb-24 lg:pt-36">
        <HeroEditorialMarks />
        <div className="home-orbit pointer-events-none absolute -right-32 -top-40 size-[32rem] rounded-full border border-white/10" />
        <div className="home-orbit home-orbit-small pointer-events-none absolute -right-16 -top-24 size-[25rem] rounded-full border border-white/10" />
        {/* Tonal wedge: deepens the right half so the collage sits in shadow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[58%] bg-[hsl(var(--foreground)/.16)] [clip-path:polygon(26%_0,100%_0,100%_100%,0_100%)]"
        />
        {/* Marigold sun with drawn concentric arcs, rising behind the collage. */}
        <div
          aria-hidden="true"
          className="sun-breathe pointer-events-none absolute right-[14%] top-[50%] size-[17rem] rounded-full border border-[hsl(var(--accent)/.45)] lg:right-[26%] lg:top-[16%] lg:size-[21rem]"
          style={{ animationDuration: "9s" }}
        />
        <div
          aria-hidden="true"
          className="ring-spin pointer-events-none absolute right-[10%] top-[46%] size-[22rem] rounded-full border border-dashed border-white/20 lg:right-[23%] lg:top-[12%] lg:size-[27rem]"
        />
        <div
          aria-hidden="true"
          className="sun-breathe pointer-events-none absolute right-[22%] top-[56%] z-0 size-[11rem] rounded-full bg-[hsl(var(--accent))] lg:right-[30%] lg:top-[20%] lg:size-[15rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 z-0 size-[30rem] rounded-full bg-[hsl(var(--accent)/.28)] blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="dot-drift dot-grid-light pointer-events-none absolute right-[6%] top-10 h-[46%] w-[42%] opacity-50"
        />
        {/* Continuous smooth soundwaves visualizer */}
        <SmoothSoundwaves />
        <span
          aria-hidden="true"
          className="ghost-drift ghost-word ghost-word-light right-[-4%] top-[52%] hidden lg:block"
        >
          LOVE
        </span>
        <span
          aria-hidden="true"
          className="spine-text pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] font-bold uppercase tracking-[.32em] text-white/30 xl:block"
        >
          MFMCF · FUNAAB · FAMILY OF LOVE
        </span>
        <span
          aria-hidden="true"
          className="twinkle pointer-events-none absolute left-[30%] top-[14%] hidden font-mono text-lg font-bold text-white/30 lg:block"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="twinkle pointer-events-none absolute bottom-[24%] right-[5%] hidden font-mono text-lg font-bold text-white/30 lg:block"
          style={{ animationDelay: "1.6s" }}
        >
          +
        </span>
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div className="relative z-10 reveal">
            <Eyebrow
              tone="accent"
              className="inline-block border border-[hsl(var(--accent)/.45)] px-3 py-1.5"
            >
              Mountain of Fire &amp; Miracles Campus Fellowship
            </Eyebrow>
            <LoopingTypewriter />
            <p className="mt-8 max-w-md text-lg leading-7 text-white/75">
              A warm, growing fellowship for students at FUNAAB — where faith
              gets practical and no one has to walk campus alone.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ActionLink href="/contact" inverted testId="link-contact-cta">
                Plan your first visit
              </ActionLink>
              <Link
                href="/about"
                data-testid="link-home-our-story"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
              >
                Meet the family{" "}
                <ArrowDownRight className="size-4 transition-transform group-hover:translate-y-1" />
              </Link>
            </div>
            {/* Hand-drawn editorial annotation drawing */}
            <HandDrawnAnnotation />
          </div>
          <div
            ref={heroCollage}
            className="relative min-h-[420px] sm:min-h-[560px]"
          >
            {/* Rotating editorial circular chapel seal */}
            <EditorialSeal />
            <PhotoFrame
              src={getSermon("the-grace-called-favour")?.image ?? ""}
              alt="Students gathered during a Sunday service"
              className="hero-photo-main absolute right-0 top-0 h-[76%] w-[78%] bg-white/10 shadow-2xl"
              testId="img-home-hero"
            />
            <PhotoFrame
              src={getSermon("life-giving-spirits")?.image ?? ""}
              alt="Three fellowship members smiling together"
              className="hero-photo-secondary absolute bottom-0 left-0 h-[54%] w-[58%] bg-white/10"
            />
            <motion.div
              drag
              dragConstraints={{ left: -35, right: 35, top: -25, bottom: 25 }}
              dragElastic={0.18}
              whileHover={{ scale: 1.06, rotate: -2, zIndex: 30 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="cursor-grab active:cursor-grabbing absolute left-0 top-8 z-10 hidden w-[32%] -rotate-[5deg] sm:block"
            >
              <div className="sticker bg-white p-2 select-none shadow-2xl">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={photos.community}
                    alt="The fellowship gathered together"
                    className="pointer-events-none h-full w-full object-cover"
                  />
                </div>
                <p className="mono-label px-1 pb-0.5 pt-2 text-[8px] text-[hsl(var(--muted-foreground))]">
                  The whole family ✦
                </p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="hero-info-card absolute bottom-10 right-0 border border-white/30 bg-[hsl(var(--foreground))] px-5 py-4 text-white shadow-xl sm:bottom-16 sm:px-7"
            >
              <Eyebrow tone="accent" className="text-[9px]">
                This Sunday
              </Eyebrow>
              <p className="mt-1 font-semibold">Word · Worship · Welcome</p>
              <p className="mt-1 text-xs text-white/60">
                New Lecture Theatre · 9:00 AM
              </p>
            </motion.div>
            <motion.span
              whileHover={{ scale: 1.25, rotate: 20 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="hero-spark absolute left-[46%] top-[29%] flex size-12 cursor-pointer items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-xl"
            >
              <Sparkles className="size-5" />
            </motion.span>
          </div>
        </div>
      </section>
      <Marquee
        items={[
          "Family of Love",
          "Word",
          "Worship",
          "Welcome",
          "Prayer",
          "Community",
          "FUNAAB Campus",
        ]}
      />
      <section className="relative overflow-hidden bg-[hsl(var(--card))] px-5 py-16 lg:px-10 lg:py-24">
        <span
          aria-hidden="true"
          className="ghost-word -bottom-10 right-[-2%]"
        >
          ROOM
        </span>
        <div
          aria-hidden="true"
          className="dot-grid absolute -left-10 -top-10 size-64 opacity-70"
        />
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="Our north star"
              title="A family that makes room."
              headingClassName="mt-5 max-w-md leading-[.96]"
            />
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="relative max-w-2xl lg:pt-10">
              <span className="sticker absolute -top-7 right-6 hidden rotate-[3deg] bg-[hsl(var(--accent))] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--foreground))] sm:block">
                Making room · since day one
              </span>
              <p className="text-2xl leading-snug text-[hsl(var(--foreground))] sm:text-3xl">
              “Family of Love” is not a line on a banner. It is how we choose
              to show up — with open seats, honest questions, loud worship,
              and the kind of care that remembers your exam timetable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="border border-[hsl(var(--primary)/.25)] px-4 py-2 text-sm text-[hsl(var(--primary))]">
                Faith with room to grow
              </span>
              <span className="border border-[hsl(var(--primary)/.25)] px-4 py-2 text-sm text-[hsl(var(--primary))]">
                People before performance
              </span>
              <span className="border border-[hsl(var(--primary)/.25)] px-4 py-2 text-sm text-[hsl(var(--primary))]">
                A home on campus
              </span>
            </div>
          </div>
          </Reveal>
        </div>
      </section>
      <section className="relative overflow-hidden px-5 py-16 lg:px-10 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-[hsl(var(--foreground)/.08)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-6 size-72 rounded-full border border-dashed border-[hsl(var(--foreground)/.12)]"
        />
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute right-1/4 top-10 size-48 opacity-60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[7%] top-[34%] hidden font-mono text-lg font-bold text-[hsl(var(--foreground)/.2)] lg:block"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[16%] right-[10%] hidden font-mono text-lg font-bold text-[hsl(var(--foreground)/.2)] lg:block"
        >
          +
        </span>
        <div className="relative z-10 mx-auto max-w-[1380px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="A week with us"
              title={
                <>
                  There’s a place
                  <br />
                  in the rhythm.
                </>
              }
              headingClassName="leading-none"
            />
            <ActionLink href="/contact" testId="link-contact-cta">
              See where to find us
            </ActionLink>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Reveal className="h-full">
              <EventCard
                day="SUN"
                title="Sunday Gathering"
                detail="A full-hearted service for the week ahead with spirited worship, the Word, and a family that knows your name."
                time="9:00 AM"
                location="New Lecture Theatre (NLT)"
                image={photos.gathering}
              />
            </Reveal>
            <Reveal className="h-full" delay={120}>
              <EventCard
                day="WED"
                title="Midweek Recharge"
                detail="Scripture study, open prayer, and deep honest conversations in between lectures to refresh your walk."
                time="5:00 PM"
                location="Family Rooms"
                image={photos.word}
              />
            </Reveal>
            <Reveal className="h-full" delay={240}>
              <EventCard
                day="FRI"
                title="Family Hangout"
                detail="A softer landing after a long campus week — laughter, indoor games, singing, and genuine connection."
                time="4:30 PM"
                location="Fellowship Grounds"
                image={photos.joy}
              />
            </Reveal>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-[hsl(var(--secondary))] px-5 py-16 lg:px-10 lg:py-24">
        <Asterisk
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -top-12 size-48 rotate-12 text-[hsl(var(--primary)/.12)]"
        />
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute bottom-8 right-[8%] size-40 opacity-60"
        />
        <div className="relative z-10 mx-auto max-w-[1380px]">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <Reveal variant="left">
              <div>
                <SectionHeading
                  eyebrow="From the archive"
                  title={
                    <>
                      God still
                      <br />
                      <em className="font-normal">speaks.</em>
                    </>
                  }
                  headingClassName="leading-[.94] tracking-[-.04em]"
                />
                <p className="mt-6 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  Catch up on a word you missed, or press play on something you
                  need today.
                </p>
                <Link
                  href="/sermons"
                  data-testid="link-home-sermon-archive"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]"
                >
                  Browse the sermon archive{" "}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal variant="scale">
                <SermonCard sermon={sermons[0]} />
              </Reveal>
              <Reveal variant="scale" delay={120}>
                <SermonCard sermon={sermons[1]} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="grain relative overflow-hidden bg-[hsl(var(--foreground))] px-5 py-20 text-white lg:px-10 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 z-0 size-[26rem] rounded-full bg-[hsl(var(--accent)/.22)] blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 z-0 size-[22rem] rounded-full bg-[hsl(var(--primary)/.35)] blur-[110px]"
        />
        <span
          aria-hidden="true"
          className="ghost-word ghost-word-light left-[-3%] top-6 hidden lg:block"
        >
          BELONG
        </span>
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <Reveal variant="left">
            <div>
              <Quote className="size-9 text-[hsl(var(--accent))]" />
              <p className="display-font mt-7 max-w-4xl text-5xl leading-[.98] tracking-[-.03em] sm:text-7xl">
                You do not have to have it all together before you belong.
              </p>
              <p className="mt-8 text-sm text-white/55">
                — A note from one of our family meetings
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="relative mx-auto w-full max-w-sm">
              <PhotoFrame
                src={getSermon("when-prayer-becomes-home")?.image ?? ""}
                alt="Students in a moment of prayer"
                frame="foreground"
                className="aspect-[4/5]"
              />
              <div className="absolute -bottom-5 -left-5 bg-[hsl(var(--accent))] px-5 py-4 text-[hsl(var(--foreground))]">
                <p className="mono-label text-[9px]">Family of Love</p>
                <p className="mt-1 text-sm font-bold">A place to be known.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="site-grid px-5 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-8 border-y border-[hsl(var(--foreground)/.14)] py-10 sm:flex-row sm:items-center">
            <div>
              <Eyebrow>Keep in touch</Eyebrow>
              <h2 className="display-font mt-3 text-4xl tracking-[-.03em] sm:text-5xl">
                The good stuff, occasionally.
              </h2>
            </div>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </Shell>
  );
}

function EventCard({
  day,
  title,
  detail,
  time,
  location,
  image,
}: {
  day: string;
  title: string;
  detail: string;
  time: string;
  location: string;
  image: string;
}) {
  return (
    <Link
      href="/contact"
      className="group relative flex h-full min-h-[440px] flex-col justify-between overflow-hidden border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] p-6 sm:p-8 shadow-[4px_4px_0px_hsl(var(--foreground))] transition-all duration-500 hover:-translate-y-2 hover:shadow-[8px_8px_0px_hsl(var(--foreground))] block cursor-pointer"
    >
      {/* Background Photo with smooth cinematic zoom */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
      />

      {/* Top Vignette for Badge & Arrow Readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
      />

      {/* Bottom Multi-Stop Deep Gradient for Crisp Text Legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[hsl(263_45%_6%)] via-[hsl(263_38%_9%)/.92] via-45% to-[hsl(263_32%_14%)/.25] transition-colors duration-500 group-hover:from-[hsl(263_50%_5%)] group-hover:via-[hsl(278_54%_12%)/.94]"
      />

      {/* Top Bar: Neo-Brutalist Day Badge & Interactive Arrow */}
      <div className="relative z-10 flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[2px_2px_0px_white]">
          <CalendarDays className="size-3.5" />
          {day}
        </span>
        <span className="flex size-9 items-center justify-center border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[hsl(var(--accent))] group-hover:bg-[hsl(var(--accent))] group-hover:text-[hsl(var(--foreground))] group-hover:rotate-45">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      {/* Bottom Content: Title, Description, Time & Location */}
      <div className="relative z-10 mt-28">
        <p className="mono-label text-[10px] tracking-widest text-[hsl(var(--accent))] font-bold">
          Weekly Gathering
        </p>
        <h3 className="display-font mt-1 text-3xl font-bold leading-tight text-white tracking-[-0.02em] transition-colors duration-300 group-hover:text-[hsl(var(--accent))] sm:text-4xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/90 font-medium line-clamp-3">
          {detail}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4 font-mono text-xs font-bold text-white/95">
          <span className="flex items-center gap-1.5 text-[hsl(var(--accent))]">
            <Clock3 className="size-4" /> {time}
          </span>
          <span className="flex items-center gap-1.5 text-white/85">
            <MapPin className="size-3.5 text-white/70" /> {location}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SermonCard({ sermon }: { sermon?: SermonView }) {
  if (!sermon) return null;
  return (
    <Link
      href={`/sermons/${sermon.slug}`}
      data-testid={`link-sermon-${sermon.title.toLowerCase().replaceAll(" ", "-")}`}
      className="group block"
    >
      <PhotoFrame
        src={sermon.image}
        alt=""
        frame="none"
        className="aspect-[1.28]"
      />
      <div className="border border-t-0 border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--card))] p-5">
        <p className="mono-label text-[9px] text-[hsl(var(--primary))]">
          Sunday service · {sermon.scripture}
        </p>
        <h3 className="mt-3 text-xl font-semibold">{sermon.title}</h3>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">
          Listen now <Play className="size-3 fill-current" />
        </span>
      </div>
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribeNewsletter();
  const sent = subscribe.isSuccess;

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) subscribe.mutate({ data: { email } });
      }}
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={sent ? "You’re on the list." : "Your email address"}
          disabled={sent || subscribe.isPending}
          data-testid="input-newsletter-email"
          className="min-w-0 flex-1 border border-[hsl(var(--foreground)/.18)] bg-[hsl(var(--card)/.6)] px-4 py-3 text-sm outline-none transition placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))]"
        />
        <button
          type="submit"
          disabled={sent || subscribe.isPending}
          data-testid="button-newsletter-submit"
          className="flex shrink-0 items-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold text-white transition hover:bg-[hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sent ? <Check className="size-4" /> : <Send className="size-4" />}
          <span className="hidden sm:inline">
            {sent ? "Thank you" : subscribe.isPending ? "Joining…" : "Join us"}
          </span>
        </button>
      </div>
      {subscribe.isError && (
        <p
          role="alert"
          data-testid="text-newsletter-error"
          className="mt-2 text-sm font-semibold text-red-600"
        >
          That didn’t go through. Please try again in a moment.
        </p>
      )}
    </form>
  );
}

export default Home;
