import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Maximize2,
  Clock3,
  MapPin,
  Play,
  Pause,
  ArrowUpRight,
} from "lucide-react";
import { Shell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/foundation";
import { useGallery, type GalleryView } from "@/lib/queries";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { photos } from "@/lib/site";

interface SpotlightItem {
  id: number;
  number: string;
  tag: string;
  category: string;
  title: string;
  desc: string;
  time: string;
  venue: string;
  image: string;
}

const HERO_SPOTLIGHTS: SpotlightItem[] = [
  {
    id: -10,
    number: "01",
    tag: "Sunday Service",
    category: "Worship",
    title: "Sunday Praise & Worship",
    desc: "Sundays at the Fellowship Auditorium are full of joy, energetic praise, and heartfelt worship as we start each week together.",
    time: "Sundays · 7:30 AM",
    venue: "Fellowship Auditorium",
    image: photos.sundayPraise,
  },
  {
    id: -11,
    number: "02",
    tag: "Midweek Prayer",
    category: "Prayer",
    title: "Midweek Prayers",
    desc: "We gather every Wednesday to pray, commit our academic work into God's hands, and encourage each other through the semester.",
    time: "Wednesdays · 5:00 PM",
    venue: "Family Rooms & Chapel",
    image: photos.prayerFervent,
  },
  {
    id: -12,
    number: "03",
    tag: "Campus Family",
    category: "Community",
    title: "Students Walking Together",
    desc: "Students from different departments and levels supporting each other through exams, projects, and everyday campus life.",
    time: "Weekly Gatherings",
    venue: "Campus Wide Fellowship",
    image: photos.familyUnity,
  },
  {
    id: -14,
    number: "04",
    tag: "Bible Study",
    category: "Teaching",
    title: "Learning God's Word",
    desc: "Practical teachings from the scriptures that help you grow in faith and make wise choices in your studies and career.",
    time: "Every Meeting",
    venue: "Fellowship Auditorium",
    image: photos.preachingWord,
  },
  {
    id: -13,
    number: "05",
    tag: "Friday Hangout",
    category: "Fellowship",
    title: "Laughter & Connection",
    desc: "Unwinding after lectures on Friday with games, good food, honest conversations, and new friends.",
    time: "Fridays · 4:30 PM",
    venue: "Fellowship Grounds",
    image: photos.fellowshipJoy,
  },
];

interface CollagePreset {
  rotate: number;
}

const COLLAGE_PRESETS: CollagePreset[] = [
  { rotate: -8.5 },
  { rotate: 5.5 },
  { rotate: -4.0 },
  { rotate: 9.0 },
  { rotate: -11.0 },
  { rotate: 4.5 },
  { rotate: -6.5 },
  { rotate: 8.0 },
  { rotate: -10.0 },
  { rotate: 6.0 },
  { rotate: -7.5 },
  { rotate: 7.0 },
  { rotate: -5.0 },
  { rotate: 8.5 },
  { rotate: -9.5 },
  { rotate: 4.0 },
];

const SPOTLIGHT_INTERVAL_MS = 4200;

function Gallery() {
  useDocumentTitle("Photo Stories & Editorial Gallery");
  const [filter, setFilter] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryView | null>(null);
  const { gallery } = useGallery();

  // Desktop Spotlight Hero States
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Mobile Scroll-Driven Focus State (image expands on scroll focus)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (typeof window === "undefined" || window.innerWidth >= 1024) return;
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        // Focus zone: upper-middle of screen (42% from top of viewport)
        const focusZone = window.innerHeight * 0.42;
        let closestIdx = 0;
        let minDistance = Infinity;

        mobileItemRefs.current.forEach((el, idx) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // Distance from card's visual center to the viewport focus zone
          const cardCenter = rect.top + Math.min(rect.height, 220) / 2;
          const dist = Math.abs(cardCenter - focusZone);

          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        setMobileActiveIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [showAll, setShowAll] = useState(false);

  // Dynamic categories from all gallery items
  const dynamicCategories = [
    "All",
    ...Array.from(new Set(gallery.map((g) => g.type).filter(Boolean))),
  ];
  const filters = dynamicCategories.length > 1 ? dynamicCategories : ["All", "Fellowship", "Gatherings"];

  // Combine fetched/store gallery with latest uploads
  const sortedGallery = [...gallery].sort((a, b) => b.id - a.id);

  const filtered = sortedGallery.filter(
    (item) => filter === "All" || item.type === filter,
  );

  // Show only 10 images initially, then expand with "See more"
  const shown = showAll ? filtered : filtered.slice(0, 10);

  const currentIndex = selectedPhoto
    ? filtered.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (filtered.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex - 1 + filtered.length) % filtered.length;
    setSelectedPhoto(filtered[nextIdx]);
  }, [currentIndex, filtered]);

  const handleNext = useCallback(() => {
    if (filtered.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % filtered.length;
    setSelectedPhoto(filtered[nextIdx]);
  }, [currentIndex, filtered]);

  // Spotlight Auto-Cycling Engine (Desktop only)
  useEffect(() => {
    // Disable auto-cycling on mobile so scroll purely controls focus
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / SPOTLIGHT_INTERVAL_MS) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % HERO_SPOTLIGHTS.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered]);

  const selectSpotlight = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const handleSpotlightPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + HERO_SPOTLIGHTS.length) % HERO_SPOTLIGHTS.length,
    );
    setProgress(0);
  };

  const handleSpotlightNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SPOTLIGHTS.length);
    setProgress(0);
  };

  // Lock body scroll when full screen image is open
  useEffect(() => {
    if (!selectedPhoto) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [selectedPhoto]);

  // Keyboard navigation for full screen view
  useEffect(() => {
    if (!selectedPhoto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPhoto, handlePrev, handleNext]);

  return (
    <Shell>
      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL HERO ACCORDION SPOTLIGHT (Inspired by Koinonia Global)
          ───────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-[hsl(var(--foreground))] text-white border-b-2 border-black/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Atmospheric Glow Backdrops */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 z-0 size-[32rem] rounded-full bg-[hsl(var(--accent)/.22)] blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 z-0 size-[28rem] rounded-full bg-[hsl(var(--primary)/.2)] blur-[150px]"
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-10">
          {/* Editorial Masthead Header */}
          <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white/90">
                Moments & Memories
              </div>
              <h1 className="display-font mt-4 text-4xl font-bold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl leading-[0.94]">
                Life in fellowship.
                <br />
                <em className="font-normal italic text-[hsl(var(--accent))]">
                  Moments we share.
                </em>
              </h1>
            </div>

            <div className="max-w-md">
              <p className="text-sm sm:text-base leading-relaxed text-white/80 font-normal">
                Snapshots from our Sunday services, midweek prayers, and everyday life
                on campus as one family in God.
              </p>
            </div>
          </div>

          {/* Progress Ticker & Play/Pause Controls Bar */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 sm:gap-3">
              {HERO_SPOTLIGHTS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSpotlight(i)}
                  aria-label={`Jump to spotlight ${item.number}`}
                  className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20 transition-all hover:h-2"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-[hsl(var(--accent))] transition-all duration-100 ease-linear"
                    style={{
                      width:
                        i === activeIndex
                          ? `${progress}%`
                          : i < activeIndex
                          ? "100%"
                          : "0%",
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSpotlightPrev}
                aria-label="Previous spotlight slide"
                className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause auto spotlight" : "Play auto spotlight"}
                className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
              >
                {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleSpotlightNext}
                aria-label="Next spotlight slide"
                className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* ── DESKTOP HORIZONTAL EXPANDING ACCORDION (lg & up) ── */}
          <div
            className="mt-6 hidden lg:flex h-[580px] xl:h-[630px] w-full gap-2.5 overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2.5 shadow-2xl"
            aria-label="Featured moments accordion"
          >
            {HERO_SPOTLIGHTS.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => selectSpotlight(i)}
                  onClick={() => selectSpotlight(i)}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    isActive ? "flex-[4.6]" : "flex-1"
                  }`}
                >
                  {/* Photo Background */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out ${
                      isActive
                        ? "scale-105 filter-none"
                        : "scale-100 brightness-[0.4] saturate-75 group-hover:brightness-[0.6] group-hover:scale-105"
                    }`}
                  />

                  {/* Dual Layer Editorial Gradients */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      isActive
                        ? "bg-gradient-to-t from-black/95 via-black/75 via-45% to-black/25 opacity-100"
                        : "bg-black/60 opacity-90 group-hover:opacity-60"
                    }`}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-transparent to-transparent"
                  />

                  {/* COLLAPSED VIEW (When Inactive) */}
                  {!isActive && (
                    <div className="relative z-10 flex size-full flex-col justify-between p-4 py-6 text-center select-none">
                      <span className="font-mono text-sm font-black text-white/50 group-hover:text-white transition-colors">
                        {item.number}
                      </span>
                      <div className="flex flex-1 items-center justify-center py-6">
                        <span className="spine-text rotate-180 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                          {item.tag}
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all group-hover:border-white/40 group-hover:bg-white/20">
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  )}

                  {/* EXPANDED VIEW (Active Spotlight) */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative z-10 flex size-full flex-col justify-between p-7 sm:p-10 select-none"
                    >
                      {/* Top Bar */}
                      <div className="flex items-start justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                          <span className="size-2 rounded-full bg-[hsl(var(--accent))]" />
                          <span className="font-mono text-xs font-black uppercase tracking-wider text-[hsl(var(--accent))]">
                            {item.tag}
                          </span>
                          <span className="text-white/40">·</span>
                          <span className="font-mono text-xs text-white/80">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-black text-white/60">
                            {item.number} / 05
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhoto({
                                id: item.id,
                                title: item.title,
                                type: item.category,
                                desc: item.desc,
                                image: item.image,
                              });
                            }}
                            title="View Full Size"
                            className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/40 hover:bg-white/20"
                          >
                            <Maximize2 className="size-4" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Editorial Content */}
                      <div className="max-w-2xl">
                        <p className="mono-label text-[11px] font-bold tracking-widest text-white/70">
                          About this moment
                        </p>
                        <h2 className="display-font mt-2 text-4xl sm:text-5xl font-bold leading-tight text-white tracking-[-0.03em]">
                          {item.title}
                        </h2>
                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/90 font-medium">
                          {item.desc}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5 font-mono text-xs">
                          <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-1.5 text-[hsl(var(--accent))] font-bold">
                              <Clock3 className="size-4" /> {item.time}
                            </span>
                            <span className="flex items-center gap-1.5 text-white/75">
                              <MapPin className="size-3.5 text-white/60" />{" "}
                              {item.venue}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhoto({
                                id: item.id,
                                title: item.title,
                                type: item.category,
                                desc: item.desc,
                                image: item.image,
                              });
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs font-bold uppercase text-white transition-all hover:bg-white/20 active:scale-95"
                          >
                            <span>View Full Size</span>
                            <ArrowUpRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── MOBILE RESPONSIVE SCROLL-FOCUSED SPOTLIGHT (< lg) ── */}
          <div
            className="mt-6 flex flex-col gap-3 lg:hidden"
            aria-label="Mobile featured moments"
          >
            {HERO_SPOTLIGHTS.map((item, i) => {
              const isActive = i === mobileActiveIndex;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    mobileItemRefs.current[i] = el;
                  }}
                  data-index={i}
                  onClick={() => setMobileActiveIndex(i)}
                  className={`relative w-full overflow-hidden rounded-xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "min-h-[440px] border-white/20 shadow-2xl bg-black"
                      : "h-[74px] border-white/10 bg-black/60 hover:border-white/20"
                  }`}
                >
                  {/* Background Photo */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`absolute inset-0 size-full object-cover object-center transition-all duration-700 ${
                      isActive
                        ? "scale-105 filter-none"
                        : "scale-100 brightness-[0.4] saturate-50"
                    }`}
                  />

                  {/* Gradient Overlay */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-gradient-to-t from-black via-black/75 via-45% to-black/35 opacity-100"
                        : "bg-black/60 opacity-80"
                    }`}
                  />

                  {/* COLLAPSED MOBILE BAR */}
                  {!isActive && (
                    <div className="relative z-10 flex size-full items-center justify-between px-4 py-3 select-none">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-black text-white/80 border border-white/10">
                          {item.number}
                        </span>
                        <div>
                          <p className="mono-label text-[10px] font-bold text-white/60">
                            {item.tag}
                          </p>
                          <p className="display-font text-base font-bold text-white truncate max-w-[200px] sm:max-w-[340px]">
                            {item.title}
                          </p>
                        </div>
                      </div>
                      <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/60">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  )}

                  {/* EXPANDED MOBILE CARD */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="relative z-10 flex size-full min-h-[440px] flex-col justify-between p-5 sm:p-7 select-none"
                    >
                      {/* Top Bar */}
                      <div className="flex items-start justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                          <span className="size-2 rounded-full bg-white/70" />
                          {item.tag}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhoto({
                              id: item.id,
                              title: item.title,
                              type: item.category,
                              desc: item.desc,
                              image: item.image,
                            });
                          }}
                          className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md active:scale-95"
                        >
                          <Maximize2 className="size-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="mt-20">
                        <p className="mono-label text-[10px] font-bold text-white/60">
                          Moment {item.number} of 05
                        </p>
                        <h3 className="display-font mt-1 text-3xl font-bold leading-tight text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/85">
                          {item.desc}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-3 font-mono text-[11px] text-white/90">
                          <span className="flex items-center gap-1 text-white/80 font-bold">
                            <Clock3 className="size-3.5" /> {item.time}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhoto({
                                id: item.id,
                                title: item.title,
                                type: item.category,
                                desc: item.desc,
                                image: item.image,
                              });
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-white hover:bg-white/20"
                          >
                            <span>View photo</span>
                            <ArrowUpRight className="size-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          THE ARCHIVE / POLAROID STORY PRINTS SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="gallery-cinema relative overflow-hidden bg-[hsl(var(--foreground))] px-3 py-12 text-white sm:px-6 lg:px-10 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 z-0 size-[26rem] rounded-full bg-[hsl(var(--accent)/.14)] blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-12 z-0 size-[22rem] rounded-full bg-[hsl(var(--primary)/.15)] blur-[130px]"
        />

        <div className="relative z-10 mx-auto max-w-[1300px]">
          {/* Section Heading */}
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:items-end sm:text-left">
            <Reveal variant="left">
              <SectionHeading
                eyebrow="Photo collection"
                eyebrowTone="accent"
                title={
                  <>
                    Memories from
                    <br />
                    <em className="font-normal text-[hsl(var(--accent))]">
                      our gatherings.
                    </em>
                  </>
                }
                headingClassName="max-w-xl leading-[.92] tracking-[-.04em] sm:text-6xl"
              />
            </Reveal>

            <div className="flex flex-col items-center gap-1 sm:items-end">
              <p className="mono-label text-[10px] text-white/60">
                Tap any photo to view full size
              </p>
              <p className="font-mono text-xs text-white/40">
                <span className="font-bold text-[hsl(var(--accent))]">
                  {String(shown.length).padStart(2, "0")}
                </span>{" "}
                photos
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-b border-white/15 pb-6 sm:justify-start">
            <span className="mr-2 mono-label text-[9px] uppercase tracking-wider text-white/50">
              Filter:
            </span>
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                data-testid={`button-gallery-filter-${item.toLowerCase()}`}
                onClick={() => {
                  setFilter(item);
                  setShowAll(false);
                }}
                className={`border px-3.5 py-1.5 text-xs font-bold transition ${
                  filter === item
                    ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                    : "border-white/20 text-white/70 hover:border-white hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Joined-Together Scattered Polaroid Collage (No Grid) */}
          <div
            className="relative mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center py-8 px-2 sm:px-4 md:px-6 overflow-visible"
            aria-label="Photo story collage"
          >
            {shown.map((item, i) => {
              const preset = COLLAGE_PRESETS[i % COLLAGE_PRESETS.length];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotate: preset.rotate,
                    transition: {
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i * 0.04, 0.3),
                    },
                  }}
                  whileHover={{
                    scale: 1.15,
                    rotate: 0,
                    zIndex: 120,
                    y: -10,
                    transition: { type: "spring", stiffness: 420, damping: 24 },
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    zIndex: Math.max(1, (shown.length - i) * 2 + 5),
                    transformOrigin: "center center",
                  }}
                  onClick={() => setSelectedPhoto(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPhoto(item);
                    }
                  }}
                  aria-label={`Open photo ${i + 1} full screen`}
                  className={`group relative shrink-0 cursor-pointer select-none outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--accent))] w-[165px] sm:w-[220px] md:w-[260px] lg:w-[280px] -mx-3 -my-4 sm:-mx-6 sm:-my-8 md:-mx-8 md:-my-11 ${
                    i % 2 === 1 ? "translate-y-2 sm:translate-y-4" : "-translate-y-2"
                  } ${
                    i % 3 === 1
                      ? "-translate-x-2 sm:-translate-x-3"
                      : "translate-x-2 sm:translate-x-3"
                  }`}
                >
                  {/* Polaroid Frame Alone */}
                  <div className="relative rounded-[2px] bg-white p-2 sm:p-2.5 pb-7 sm:pb-9 shadow-[0_14px_32px_-6px_rgba(0,0,0,0.55),0_6px_14px_rgba(0,0,0,0.3)] ring-1 ring-black/10 transition-shadow duration-300 group-hover:shadow-[0_28px_60px_-10px_rgba(0,0,0,0.75),0_12px_24px_rgba(0,0,0,0.4)]">
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-900/10 shadow-inner">
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* See more moments button if there are more than 10 photos */}
          {filtered.length > 10 && (
            <div className="mt-12 mb-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="group inline-flex items-center gap-2.5 border-2 border-[hsl(var(--accent))] bg-[hsl(var(--accent))] px-8 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[4px_4px_0px_white] transition hover:-translate-y-1 hover:bg-white"
              >
                {showAll ? (
                  <span>Show first 10 photos only</span>
                ) : (
                  <>
                    <span>See more moments ({filtered.length - 10} more)</span>
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          )}

          {shown.length === 0 && (
            <div className="mt-16 text-center py-16 border border-dashed border-white/20">
              <p className="mono-label text-sm text-white/60">
                No photo stories found in "{filter}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            key="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-3 sm:p-6 md:p-8 select-none"
            aria-modal="true"
            role="dialog"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close full screen view"
              className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[120] flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30 hover:scale-105 active:scale-95"
            >
              <X className="size-6" />
            </button>

            {/* Prev Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[120] flex size-11 sm:size-13 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="size-6 sm:size-7" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[120] flex size-11 sm:size-13 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="size-6 sm:size-7" />
            </button>

            {/* Lightbox Image with Smooth Spring */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex items-center justify-center max-h-[92vh] max-w-[94vw]"
            >
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title || ""}
                className="max-h-[90vh] max-w-[92vw] w-auto h-auto object-contain shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-none pointer-events-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

export default Gallery;
