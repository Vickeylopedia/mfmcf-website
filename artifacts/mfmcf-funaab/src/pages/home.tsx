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

const HERO_PHRASES = [
  {
    line1: "MFMCF",
    line2: "FUNAAB",
    badge: "FELLOWSHIP ON CAMPUS",
  },
  {
    line1: "Sincerely we",
    line2: "Love you",
    badge: "FAMILY OF LOVE",
  },
];

type TypingPhase =
  | "typing-1"
  | "typing-2"
  | "hold"
  | "erasing-2"
  | "erasing-1"
  | "pause-next";

function HeroHeadline() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<TypingPhase>("typing-1");
  const [charCount1, setCharCount1] = useState(0);
  const [charCount2, setCharCount2] = useState(0);

  const current = HERO_PHRASES[phraseIdx];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing-1") {
      if (charCount1 < current.line1.length) {
        timer = setTimeout(() => {
          setCharCount1((prev) => prev + 1);
        }, 90);
      } else {
        timer = setTimeout(() => {
          setPhase("typing-2");
        }, 110);
      }
    } else if (phase === "typing-2") {
      if (charCount2 < current.line2.length) {
        timer = setTimeout(() => {
          setCharCount2((prev) => prev + 1);
        }, 90);
      } else {
        timer = setTimeout(() => {
          setPhase("hold");
        }, 2800);
      }
    } else if (phase === "hold") {
      timer = setTimeout(() => {
        setPhase("erasing-2");
      }, 400);
    } else if (phase === "erasing-2") {
      if (charCount2 > 0) {
        timer = setTimeout(() => {
          setCharCount2((prev) => prev - 1);
        }, 45);
      } else {
        timer = setTimeout(() => {
          setPhase("erasing-1");
        }, 70);
      }
    } else if (phase === "erasing-1") {
      if (charCount1 > 0) {
        timer = setTimeout(() => {
          setCharCount1((prev) => prev - 1);
        }, 45);
      } else {
        timer = setTimeout(() => {
          setPhase("pause-next");
        }, 200);
      }
    } else if (phase === "pause-next") {
      timer = setTimeout(() => {
        setPhraseIdx((prev) => (prev + 1) % HERO_PHRASES.length);
        setCharCount1(0);
        setCharCount2(0);
        setPhase("typing-1");
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [phase, charCount1, charCount2, current.line1.length, current.line2.length]);

  const displayedLine1 = current.line1.slice(0, charCount1);
  const displayedLine2 = current.line2.slice(0, charCount2);

  const showCursorOnLine1 =
    phase === "typing-1" ||
    phase === "erasing-1" ||
    (phase === "typing-2" && charCount2 === 0);

  const showCursorOnLine2 =
    (phase === "typing-2" && charCount2 > 0) ||
    phase === "hold" ||
    phase === "erasing-2";

  return (
    <div className="mt-6 min-h-[170px] sm:min-h-[220px] lg:min-h-[280px]">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 border border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent)/.15)] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[hsl(var(--accent))]">
          <span className="size-1.5 rounded-full bg-[hsl(var(--accent))]" />
          {current.badge}
        </span>
      </div>

      <h1
        className="display-font text-[2.75rem] leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[7.2rem] select-none"
        aria-label="MFMCF FUNAAB — Sincerely we Love you"
      >
        <span className="block text-white">
          {displayedLine1 || "\u00A0"}
          {showCursorOnLine1 && (
            <span
              aria-hidden="true"
              className="inline-block w-[3px] sm:w-[5px] lg:w-[6px] h-[0.82em] ml-1 bg-[hsl(var(--accent))] align-baseline animate-pulse shadow-[0_0_8px_hsl(var(--accent))]"
            />
          )}
        </span>
        <span className="block mt-1 sm:mt-2">
          <em className="font-normal text-[hsl(var(--accent))]">
            {displayedLine2 || "\u00A0"}
          </em>
          {showCursorOnLine2 && (
            <span
              aria-hidden="true"
              className="inline-block w-[3px] sm:w-[5px] lg:w-[6px] h-[0.82em] ml-1 bg-[hsl(var(--accent))] align-baseline animate-pulse shadow-[0_0_8px_hsl(var(--accent))]"
            />
          )}
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
              duration: 5.2 + (i % 6) * 0.8,
              delay: (i % 9) * 0.25,
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
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-5 top-5 z-20 hidden items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/40 sm:flex"
    >
      <span className="size-2 rounded-full border border-white/40" />
      <span>MFMCF · FUNAAB CAMPUS FELLOWSHIP</span>
    </div>
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
            <HeroHeadline />
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
              eyebrow="Who we are"
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
              eyebrow="Weekly meetings"
              title={
                <>
                  Join us
                  <br />
                  this week.
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
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal variant="left">
              <div>
                <SectionHeading
                  eyebrow="Recent sermons"
                  title={
                    <>
                      God still
                      <br />
                      <em className="font-normal">speaks.</em>
                    </>
                  }
                  headingClassName="leading-[.94] tracking-[-.04em]"
                />
                <p className="mt-4 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  Catch up on a message you missed, or listen to what you need
                  today.
                </p>
              </div>
            </Reveal>
            <Reveal variant="right" delay={100}>
              <Link
                href="/sermons"
                data-testid="link-home-sermon-archive"
                className="inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))] transition hover:translate-x-1"
              >
                Browse the sermon archive{" "}
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          {/* Non-stop horizontal scrolling carousel: only 4 latest sermons, horizontal on mobile */}
          <div className="mt-10 sm:mt-12">
            <SermonCarousel sermons={sermons} />
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
              <Eyebrow>Stay updated</Eyebrow>
              <h2 className="display-font mt-3 text-4xl tracking-[-.03em] sm:text-5xl">
                Get updates from fellowship.
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

function SermonCard({
  sermon,
  index = 0,
}: {
  sermon?: SermonView;
  index?: number;
}) {
  if (!sermon) return null;
  return (
    <Link
      href={`/sermons/${sermon.slug}`}
      data-testid={`link-sermon-${sermon.title.toLowerCase().replaceAll(" ", "-")}-${index}`}
      className="group block w-[260px] sm:w-[310px] shrink-0 select-none transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))]">
        <img
          src={sermon.image}
          alt={sermon.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/assets/image_1787353067577.png";
          }}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-lg">
            <Play className="ml-0.5 size-4 fill-current" />
          </span>
        </div>
      </div>
      <div className="border-2 border-t-0 border-[hsl(var(--foreground))] bg-[hsl(var(--card))] p-4 sm:p-5 shadow-[3px_3px_0px_hsl(var(--foreground))]">
        <p className="mono-label text-[9px] font-bold text-[hsl(var(--primary))] truncate">
          {sermon.tag || "Sunday service"} · {sermon.scripture || sermon.date}
        </p>
        <h3 className="display-font mt-2 text-lg sm:text-xl font-bold leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[hsl(var(--primary))]">
          {sermon.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-[hsl(var(--muted-foreground))] truncate">
          {sermon.speaker}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--foreground)/.12)] pt-3 text-xs font-bold text-[hsl(var(--primary))]">
          <span>Listen now</span>
          <span className="flex size-5 items-center justify-center bg-[hsl(var(--primary))] text-white transition-transform duration-200 group-hover:translate-x-1">
            <Play className="ml-0.5 size-2.5 fill-current" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SermonCarousel({ sermons }: { sermons: SermonView[] }) {
  // Only four of the latest sermons should be displayed at the home screen
  const latestSermons = sermons.slice(0, 4);
  if (!latestSermons.length) return null;

  // Duplicate items to create a continuous, non-stop seamless infinite loop
  const base =
    latestSermons.length >= 4
      ? latestSermons
      : [...latestSermons, ...latestSermons, ...latestSermons, ...latestSermons].slice(0, 4);
  const loopItems = [...base, ...base];

  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* Editorial side edge gradient masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-[hsl(var(--secondary))] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-[hsl(var(--secondary))] to-transparent"
      />

      {/* Non-stop horizontal scrolling track */}
      <motion.div
        className="flex flex-row flex-nowrap gap-4 sm:gap-6 will-change-transform"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 22,
        }}
      >
        {loopItems.map((sermon, idx) => (
          <SermonCard
            key={`${sermon.slug}-${idx}`}
            sermon={sermon}
            index={idx}
          />
        ))}
      </motion.div>
    </div>
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
