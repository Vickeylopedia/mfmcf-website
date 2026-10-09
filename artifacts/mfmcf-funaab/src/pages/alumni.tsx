import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame,
  Crown,
  Search,
  Sparkles,
  Quote,
  BookOpen,
  GraduationCap,
  X,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowUpRight,
  Maximize2,
} from "lucide-react";
import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTenures, type Executive, type Tenure } from "@/lib/queries";

const SPOTLIGHT_INTERVAL_MS = 4600;

function Alumni() {
  useDocumentTitle("Alumni & Executive Roll");

  const { tenures } = useTenures();
  const [selectedTenureId, setSelectedTenureId] = useState<string>("power-and-fire");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExec, setActiveExec] = useState<{
    exec: Executive;
    tenureName: string;
    session: string;
  } | null>(null);
  const [copiedProfile, setCopiedProfile] = useState(false);

  // Desktop Central Spotlight Accordion States (just like the gallery)
  const [centralIndex, setCentralIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Mobile Central Spotlight Focus States
  const [mobileCentralIndex, setMobileCentralIndex] = useState(0);
  const mobileCentralRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeTenure: Tenure = useMemo(() => {
    return tenures.find((t) => t.id === selectedTenureId) || tenures[0];
  }, [tenures, selectedTenureId]);

  // Reset central spotlight active index on tenure switch
  useEffect(() => {
    setCentralIndex(0);
    setMobileCentralIndex(0);
    setProgress(0);
  }, [selectedTenureId]);

  // Filtered executives based on search query
  const filteredCentrals = useMemo(() => {
    if (!searchQuery.trim()) return activeTenure.centrals;
    const q = searchQuery.toLowerCase();
    return activeTenure.centrals.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [activeTenure, searchQuery]);

  const filteredExecutives = useMemo(() => {
    if (!searchQuery.trim()) return activeTenure.executives;
    const q = searchQuery.toLowerCase();
    return activeTenure.executives.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [activeTenure, searchQuery]);

  // Mobile scroll driven focus for Central Spotlight (identical to gallery)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (typeof window === "undefined" || window.innerWidth >= 1024) return;
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const focusZone = window.innerHeight * 0.42;
        let closestIdx = 0;
        let minDistance = Infinity;

        mobileCentralRefs.current.forEach((el, idx) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const cardCenter = rect.top + Math.min(rect.height, 220) / 2;
          const dist = Math.abs(cardCenter - focusZone);

          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        setMobileCentralIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredCentrals]);

  // Desktop Central Spotlight Auto Cycling Engine (identical to gallery)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (!isPlaying || isHovered || filteredCentrals.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / SPOTLIGHT_INTERVAL_MS) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCentralIndex((current) => (current + 1) % filteredCentrals.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, filteredCentrals.length]);

  const selectCentral = (index: number) => {
    setCentralIndex(index);
    setProgress(0);
  };

  const handleSpotlightPrev = () => {
    if (filteredCentrals.length === 0) return;
    setCentralIndex(
      (prev) => (prev - 1 + filteredCentrals.length) % filteredCentrals.length
    );
    setProgress(0);
  };

  const handleSpotlightNext = () => {
    if (filteredCentrals.length === 0) return;
    setCentralIndex((prev) => (prev + 1) % filteredCentrals.length);
    setProgress(0);
  };

  const handleCopyProfile = () => {
    if (!activeExec) return;
    const url = window.location.href.split("#")[0];
    const text = `${activeExec.exec.name}: ${activeExec.exec.role} (${activeExec.tenureName}, ${activeExec.session}) | MFMCF FUNAAB: ${url}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedProfile(true);
      setTimeout(() => setCopiedProfile(false), 2200);
    });
  };

  return (
    <Shell>
      {/* ── 1. PAGE INTRO ── */}
      <PageIntro
        eyebrow="Leadership Roll and Heritage"
        ghost="LEGACY"
        title={
          <>
            The hands that served.
            <br />
            <em className="font-normal">The hearts that led.</em>
          </>
        }
        intro="Honouring the devoted student leaders who gave their prayers, strength, and love to shepherd the family of MFMCF FUNAAB across every glorious season."
      >
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <div className="border-t border-[hsl(var(--foreground)/.2)] pt-4">
            <p className="display-font text-3xl font-bold text-[hsl(var(--primary))] sm:text-4xl">
              2 Councils
            </p>
            <p className="mt-2 text-sm leading-snug text-[hsl(var(--muted-foreground))]">
              Curated past and present executive administrations
            </p>
          </div>
          <div className="border-t border-[hsl(var(--foreground)/.2)] pt-4">
            <p className="display-font text-3xl font-bold text-[hsl(var(--primary))] sm:text-4xl">
              25+ Portfolios
            </p>
            <p className="mt-2 text-sm leading-snug text-[hsl(var(--muted-foreground))]">
              Stewards of prayer, worship, care, and truth
            </p>
          </div>
          <div className="border-t border-[hsl(var(--foreground)/.2)] pt-4">
            <p className="display-font text-3xl font-bold text-[hsl(var(--primary))] sm:text-4xl">
              One Altar
            </p>
            <p className="mt-2 text-sm leading-snug text-[hsl(var(--muted-foreground))]">
              United in raising disciples across FUNAAB
            </p>
          </div>
        </div>
      </PageIntro>

      {/* ── 2. INNOVATIVE TENURE SWITCHER & CURATED ERA EXHIBITION ── */}
      <section className="border-t-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary)/.35)] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                Curated Eras of Service
              </p>
              <h2 className="display-font mt-2 text-3xl sm:text-4xl">
                Choose an executive tenure to explore
              </h2>
              <p className="mt-2 max-w-xl text-xs text-[hsl(var(--muted-foreground))] sm:text-sm">
                Each tenure carries its distinct spiritual mandate and leadership mantle. Select an era below to view its leaders.
              </p>
            </div>

            {/* Interactive Tenure Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              {tenures.map((tenure) => {
                const isSelected = tenure.id === selectedTenureId;
                const isPresent = tenure.id === "power-and-fire";
                return (
                  <button
                    key={tenure.id}
                    type="button"
                    onClick={() => {
                      setSelectedTenureId(tenure.id);
                      setSearchQuery("");
                    }}
                    className={`group relative flex items-center gap-3 border-2 border-[hsl(var(--foreground))] px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[hsl(var(--foreground))] text-white shadow-[4px_4px_0px_hsl(var(--accent))]"
                        : "bg-white text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] hover:bg-[hsl(var(--accent)/.2)]"
                    }`}
                  >
                    <div
                      className={`flex size-8 items-center justify-center border border-current ${
                        isSelected
                          ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                          : "bg-[hsl(var(--secondary))]"
                      }`}
                    >
                      {isPresent ? (
                        <Flame className="size-4 text-amber-500" />
                      ) : (
                        <Crown className="size-4 text-[hsl(var(--primary))]" />
                      )}
                    </div>
                    <div>
                      <span className="mono-label block text-[9px] opacity-75">
                        {tenure.status}
                      </span>
                      <span className="display-font block text-sm font-bold sm:text-base">
                        {tenure.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tenure Banner Card */}
          <div className="mt-8 border-2 border-[hsl(var(--foreground))] bg-white p-5 shadow-[5px_5px_0px_hsl(var(--foreground))] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_.9fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-[hsl(var(--foreground))]">
                    {activeTenure.badge}
                  </span>
                  <span className="border border-[hsl(var(--foreground)/.25)] bg-[hsl(var(--secondary))] px-2.5 py-1 font-mono text-[10px] font-bold text-[hsl(var(--foreground))]">
                    {activeTenure.session}
                  </span>
                </div>

                <h3 className="display-font mt-4 text-3xl font-bold tracking-tight text-[hsl(var(--primary))] sm:text-5xl">
                  {activeTenure.name}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                  {activeTenure.vision}
                </p>
              </div>

              {/* Theme Scripture Callout Box */}
              <div className="flex flex-col justify-between border-2 border-[hsl(var(--foreground)/.15)] bg-[hsl(var(--secondary)/.4)] p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">
                    <BookOpen className="size-4" />
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      Tenure Scripture Anchor
                    </span>
                  </div>
                  <p className="display-font mt-3 text-lg italic leading-snug text-[hsl(var(--foreground))] sm:text-xl">
                    "{activeTenure.verseText}"
                  </p>
                </div>
                <p className="mono-label mt-4 text-right text-xs font-bold text-[hsl(var(--primary))]">
                  {activeTenure.verseRef}
                </p>
              </div>
            </div>

            {/* Quick search inside tenure */}
            <div className="mt-6 border-t border-[hsl(var(--foreground)/.15)] pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="mono-label text-[10px] text-[hsl(var(--muted-foreground))]">
                  Showing {filteredCentrals.length + filteredExecutives.length} Leaders in {activeTenure.name}
                </p>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search executive or role…"
                    className="w-full border border-[hsl(var(--foreground)/.25)] bg-white py-1.5 pl-8 pr-3 font-mono text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--muted-foreground))] hover:text-black cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THE CENTRAL FOUR SPOTLIGHT (IDENTICAL TO GALLERY SPOTLIGHT) ── */}
      <section
        className="relative overflow-hidden bg-[hsl(var(--foreground))] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-24"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Atmospheric Glow Backdrops */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 z-0 size-[32rem] rounded-full bg-[hsl(var(--accent)/.2)] blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 z-0 size-[28rem] rounded-full bg-[hsl(var(--primary)/.25)] blur-[150px]"
        />

        <div className="relative z-10 mx-auto max-w-[1380px]">
          {/* Section Heading & Description */}
          <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
                <Sparkles className="size-3.5" /> Core Executive Council
              </div>
              <h2 className="display-font mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                The Central Leadership
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
                The four principal officers serving at the spiritual and administrative helm of {activeTenure.name}.
              </p>
            </div>
          </div>

          {filteredCentrals.length === 0 ? (
            <p className="py-8 font-mono text-xs text-white/60">
              No central executive found matching your search.
            </p>
          ) : (
            <>
              {/* Progress Ticker & Play/Pause Controls Bar */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 sm:gap-3">
                  {filteredCentrals.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectCentral(i)}
                      aria-label={`Jump to central executive ${i + 1}`}
                      className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20 transition-all hover:h-2 cursor-pointer"
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-[hsl(var(--accent))] transition-all duration-100 ease-linear"
                        style={{
                          width:
                            i === centralIndex
                              ? `${progress}%`
                              : i < centralIndex
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
                    aria-label="Previous central executive"
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? "Pause auto cycle" : "Play auto cycle"}
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleSpotlightNext}
                    aria-label="Next central executive"
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* ── DESKTOP HORIZONTAL EXPANDING ACCORDION SPOTLIGHT (lg & up) ── */}
              <div
                className="mt-6 hidden lg:flex h-[560px] xl:h-[610px] w-full gap-2.5 overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2.5 shadow-2xl"
                aria-label="Central leadership spotlight accordion"
              >
                {filteredCentrals.map((item, i) => {
                  const isActive = i === centralIndex;
                  const numberFormatted = `0${i + 1}`;

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => selectCentral(i)}
                      onClick={() => selectCentral(i)}
                      className={`group relative overflow-hidden rounded-xl cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                        isActive ? "flex-[4.6]" : "flex-1"
                      }`}
                    >
                      {/* Photo Background */}
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/assets/image_1787352840643.png";
                        }}
                        className={`absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out ${
                          isActive
                            ? "scale-105 filter-none"
                            : "scale-100 brightness-[0.38] saturate-75 group-hover:brightness-[0.55] group-hover:scale-105"
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
                            {numberFormatted}
                          </span>
                          <div className="flex flex-1 items-center justify-center py-6">
                            <span className="spine-text rotate-180 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                              {item.role}
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
                                {item.role}
                              </span>
                              <span className="text-white/40">·</span>
                              <span className="font-mono text-xs text-white/80">
                                {activeTenure.session}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-black text-white/60">
                                {numberFormatted} / 0{filteredCentrals.length}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveExec({
                                    exec: item,
                                    tenureName: activeTenure.name,
                                    session: activeTenure.session,
                                  });
                                }}
                                title="View Profile"
                                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-white/40 hover:bg-white/20 cursor-pointer"
                              >
                                <Maximize2 className="size-4" />
                              </button>
                            </div>
                          </div>

                          {/* Bottom Editorial Content */}
                          <div className="max-w-2xl">
                            <p className="mono-label text-[11px] font-bold tracking-widest text-[hsl(var(--accent))]">
                              Central Executive Officer
                            </p>
                            <h2 className="display-font mt-2 text-4xl sm:text-5xl font-bold leading-tight text-white tracking-tight">
                              {item.name}
                            </h2>

                            <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                              <GraduationCap className="size-4 text-[hsl(var(--accent))]" />
                              <span>{item.department}</span>
                            </p>

                            {item.quote && (
                              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/90 font-medium italic">
                                "{item.quote}"
                              </p>
                            )}

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5 font-mono text-xs">
                              {item.scripture ? (
                                <span className="flex items-center gap-1.5 text-[hsl(var(--accent))] font-bold">
                                  <BookOpen className="size-4" /> Anchor: {item.scripture}
                                </span>
                              ) : (
                                <span className="text-white/60">{activeTenure.name}</span>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveExec({
                                    exec: item,
                                    tenureName: activeTenure.name,
                                    session: activeTenure.session,
                                  });
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs font-bold uppercase text-white transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
                              >
                                <span>View Full Profile</span>
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

              {/* ── MOBILE RESPONSIVE SCROLL/TAP SPOTLIGHT (< lg) ── */}
              <div
                className="mt-6 flex flex-col gap-3 lg:hidden"
                aria-label="Mobile central leadership spotlight"
              >
                {filteredCentrals.map((item, i) => {
                  const isActive = i === mobileCentralIndex;
                  const numberFormatted = `0${i + 1}`;

                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        mobileCentralRefs.current[i] = el;
                      }}
                      data-index={i}
                      onClick={() => setMobileCentralIndex(i)}
                      className={`relative w-full overflow-hidden rounded-xl border transition-all duration-500 cursor-pointer ${
                        isActive
                          ? "min-h-[440px] border-white/25 shadow-2xl bg-black"
                          : "h-[74px] border-white/10 bg-black/60 hover:border-white/20"
                      }`}
                    >
                      {/* Background Photo */}
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/assets/image_1787352840643.png";
                        }}
                        className={`absolute inset-0 size-full object-cover object-center transition-all duration-700 ${
                          isActive
                            ? "scale-105 filter-none"
                            : "scale-100 brightness-[0.38] saturate-50"
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
                              {numberFormatted}
                            </span>
                            <div>
                              <p className="mono-label text-[10px] font-bold text-[hsl(var(--accent))]">
                                {item.role}
                              </p>
                              <p className="display-font text-base font-bold text-white truncate max-w-[200px] sm:max-w-[340px]">
                                {item.name}
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
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))] backdrop-blur-md">
                              <span className="size-2 rounded-full bg-[hsl(var(--accent))]" />
                              {item.role}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveExec({
                                  exec: item,
                                  tenureName: activeTenure.name,
                                  session: activeTenure.session,
                                });
                              }}
                              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md active:scale-95 cursor-pointer"
                            >
                              <Maximize2 className="size-4" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="mt-20">
                            <p className="mono-label text-[10px] font-bold text-white/60">
                              Central Pillar {numberFormatted} of 0{filteredCentrals.length}
                            </p>
                            <h3 className="display-font mt-1 text-3xl font-bold leading-tight text-white">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-xs text-white/80">
                              {item.department}
                            </p>
                            {item.quote && (
                              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/90 italic">
                                "{item.quote}"
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-3 font-mono text-[11px] text-white/90">
                              {item.scripture ? (
                                <span className="flex items-center gap-1 text-[hsl(var(--accent))] font-bold">
                                  <BookOpen className="size-3.5" /> {item.scripture}
                                </span>
                              ) : (
                                <span className="text-white/60">{activeTenure.session}</span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveExec({
                                    exec: item,
                                    tenureName: activeTenure.name,
                                    session: activeTenure.session,
                                  });
                                }}
                                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-white hover:bg-white/20 cursor-pointer"
                              >
                                <span>Profile</span>
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
            </>
          )}
        </div>
      </section>

      {/* ── 4. THE REST OF THE EXECUTIVE COUNCIL (TWO IMAGES PER LINE ON MOBILE) ── */}
      <section className="border-t-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary)/.2)] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-10 flex flex-col gap-3 border-b-2 border-[hsl(var(--foreground))] pb-6">
            <p className="mono-label text-[11px] font-bold text-[hsl(var(--primary))]">
              Council Portfolios
            </p>
            <h2 className="display-font text-3xl sm:text-5xl">
              Departmental Directors & Secretaries
            </h2>
            <p className="max-w-2xl text-xs text-[hsl(var(--muted-foreground))] sm:text-sm">
              The ministers and directors coordinating spiritual units, worship, fellowship logistics, prayer, and student welfare.
            </p>
          </div>

          {filteredExecutives.length === 0 ? (
            <p className="py-8 font-mono text-xs text-[hsl(var(--muted-foreground))]">
              No executive found matching your search term.
            </p>
          ) : (
            /* User requirement: strictly two images per line for mobile! (grid-cols-2) */
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {filteredExecutives.map((exec, idx) => (
                <Reveal key={exec.id} delay={Math.min(idx, 6) * 50}>
                  <div
                    onClick={() =>
                      setActiveExec({
                        exec,
                        tenureName: activeTenure.name,
                        session: activeTenure.session,
                      })
                    }
                    className="group flex flex-col border-2 border-[hsl(var(--foreground))] bg-white shadow-[3px_3px_0px_hsl(var(--foreground))] transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0px_hsl(var(--primary))] cursor-pointer"
                  >
                    {/* Compact Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden border-b-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))]">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/assets/image_1787352840643.png";
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/.5)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Card Content tailored for 2 columns on mobile */}
                    <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
                      <div>
                        <span className="mono-label block text-[8px] font-black uppercase text-[hsl(var(--primary))] sm:text-[10px]">
                          {exec.role}
                        </span>
                        <h4 className="display-font mt-1 line-clamp-1 text-sm font-bold sm:text-lg">
                          {exec.name}
                        </h4>
                        <p className="mt-1 line-clamp-1 text-[10px] text-[hsl(var(--muted-foreground))] sm:text-xs">
                          {exec.department}
                        </p>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between border-t border-[hsl(var(--foreground)/.1)] pt-2 text-[10px] text-[hsl(var(--primary))] font-mono font-bold">
                        <span>Profile</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. ALUMNI COMMUNITY CALLOUT ── */}
      <section className="bg-[hsl(var(--primary))] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-[1100px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="mono-label text-[10px] text-[hsl(var(--accent))]">
              Once a Family, Always a Family
            </span>
            <h2 className="display-font mt-3 text-3xl sm:text-4xl">
              Are you an alumnus of MFMCF FUNAAB?
            </h2>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">
              We cherish every sacrifice you made on campus. Stay connected with the current executive council, receive prayer bulletins, and join hands in mentoring the next generation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" inverted>
              Reach Secretariat
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── 6. EXECUTIVE PROFILE MODAL (INNOVATIVE POPUP) ── */}
      <AnimatePresence>
        {activeExec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExec(null)}
              className="absolute inset-0 bg-[hsl(var(--foreground)/.75)] backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-lg border-2 border-[hsl(var(--foreground))] bg-white p-5 shadow-[8px_8px_0px_hsl(var(--foreground))] sm:p-7 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setActiveExec(null)}
                className="absolute right-4 top-4 border-2 border-[hsl(var(--foreground))] bg-white p-1 text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] active:translate-y-0.5 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] shadow-[3px_3px_0px_hsl(var(--foreground))] sm:w-40">
                  <img
                    src={activeExec.exec.image}
                    alt={activeExec.exec.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/image_1787352840643.png";
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-2 py-0.5 font-mono text-[9px] font-black uppercase text-[hsl(var(--foreground))]">
                      {activeExec.exec.role}
                    </span>
                    <span className="font-mono text-[9px] text-[hsl(var(--muted-foreground))]">
                      {activeExec.session}
                    </span>
                  </div>

                  <h3 className="display-font mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                    {activeExec.exec.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                    <GraduationCap className="size-3.5 text-[hsl(var(--primary))]" />
                    <span>{activeExec.exec.department}</span>
                  </p>

                  <p className="mono-label mt-2 text-[10px] text-[hsl(var(--primary))] font-bold">
                    {activeExec.tenureName}
                  </p>
                </div>
              </div>

              {activeExec.exec.quote && (
                <div className="mt-5 border-2 border-[hsl(var(--foreground)/.15)] bg-[hsl(var(--secondary)/.3)] p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--primary))]">
                    <Quote className="size-3.5" />
                    <span className="font-mono text-[10px] uppercase">
                      Executive Word
                    </span>
                  </div>
                  <p className="mt-2 text-xs italic leading-relaxed text-[hsl(var(--foreground))] sm:text-sm">
                    "{activeExec.exec.quote}"
                  </p>
                  {activeExec.exec.scripture && (
                    <p className="mono-label mt-3 text-right text-[10px] font-bold text-[hsl(var(--primary))]">
                      {activeExec.exec.scripture}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--foreground)/.15)] pt-4">
                <button
                  type="button"
                  onClick={handleCopyProfile}
                  className="flex items-center gap-2 border-2 border-[hsl(var(--foreground))] bg-white px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] active:translate-y-0.5 cursor-pointer"
                >
                  {copiedProfile ? (
                    <Check className="size-3.5 text-green-600" />
                  ) : (
                    <Share2 className="size-3.5" />
                  )}
                  <span>
                    {copiedProfile ? "Profile copied!" : "Share profile"}
                  </span>
                </button>

                <ButtonLink href="/contact">
                  Send greeting
                </ButtonLink>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

export default Alumni;
