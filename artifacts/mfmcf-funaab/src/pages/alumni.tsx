import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame,
  Crown,
  Search,
  Sparkles,
  Quote,
  BookOpen,
  GraduationCap,
  Heart,
  X,
  Share2,
  Check,
} from "lucide-react";
import { Shell, ButtonLink } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { tenures, type Executive, type Tenure } from "@/data/executives";

function Alumni() {
  useDocumentTitle("Alumni & Executive Roll");

  const [selectedTenureId, setSelectedTenureId] = useState<Tenure["id"]>(
    "power-and-fire"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExec, setActiveExec] = useState<{
    exec: Executive;
    tenureName: string;
    session: string;
  } | null>(null);
  const [copiedProfile, setCopiedProfile] = useState(false);

  const activeTenure = useMemo(() => {
    return tenures.find((t) => t.id === selectedTenureId) || tenures[0];
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

  const handleCopyProfile = () => {
    if (!activeExec) return;
    const url = window.location.href.split("#")[0];
    const text = `${activeExec.exec.name} — ${activeExec.exec.role} (${activeExec.tenureName}, ${activeExec.session}) | MFMCF FUNAAB: ${url}`;
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

      {/* ── 3. THE CENTRAL FOUR (PRESIDENT, VP, GEN SEC, SISTERS COORD) ── */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-10 flex flex-col gap-3 border-b-2 border-[hsl(var(--foreground))] pb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[hsl(var(--accent))]" />
              <p className="mono-label text-[11px] font-bold text-[hsl(var(--primary))]">
                Core Leadership Pillar
              </p>
            </div>
            <h2 className="display-font text-3xl sm:text-5xl">
              The Central Executives
            </h2>
            <p className="max-w-2xl text-xs text-[hsl(var(--muted-foreground))] sm:text-sm">
              The four principal officers serving at the spiritual and administrative helm of the fellowship council.
            </p>
          </div>

          {filteredCentrals.length === 0 ? (
            <p className="py-8 font-mono text-xs text-[hsl(var(--muted-foreground))]">
              No central executive found matching your search term.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredCentrals.map((exec, idx) => {
                const badgeLabel =
                  exec.role === "President"
                    ? "Presidency"
                    : exec.role === "Vice President"
                    ? "Vice Presidency"
                    : exec.role === "General Secretary"
                    ? "Secretariat"
                    : "Sisters Wing";

                return (
                  <Reveal key={exec.id} delay={idx * 80}>
                    <div
                      onClick={() =>
                        setActiveExec({
                          exec,
                          tenureName: activeTenure.name,
                          session: activeTenure.session,
                        })
                      }
                      className="group relative flex flex-col border-2 border-[hsl(var(--foreground))] bg-white shadow-[5px_5px_0px_hsl(var(--foreground))] transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0px_hsl(var(--primary))] cursor-pointer"
                    >
                      {/* Bold Badge */}
                      <div className="flex items-center justify-between border-b-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary)/.6)] px-3.5 py-2">
                        <span className="mono-label text-[10px] font-black text-[hsl(var(--foreground))]">
                          ★ {badgeLabel}
                        </span>
                        <span className="mono-label text-[9px] text-[hsl(var(--muted-foreground))]">
                          0{idx + 1}
                        </span>
                      </div>

                      {/* Prominent Bold Portrait Image */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden border-b-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))]">
                        <img
                          src={exec.image}
                          alt={exec.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/assets/image_1787352840643.png";
                          }}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground)/.6)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[hsl(var(--foreground))] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          View profile →
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                        <div>
                          <p className="mono-label text-[10px] font-black uppercase tracking-wider text-[hsl(var(--primary))]">
                            {exec.role}
                          </p>
                          <h3 className="display-font mt-1.5 text-xl font-bold leading-snug sm:text-2xl">
                            {exec.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                            <GraduationCap className="size-3.5 shrink-0 text-[hsl(var(--primary))]" />
                            <span className="line-clamp-1">{exec.department}</span>
                          </p>
                        </div>

                        {exec.quote && (
                          <div className="mt-4 border-t border-[hsl(var(--foreground)/.1)] pt-3">
                            <p className="text-xs italic leading-relaxed text-[hsl(var(--foreground)/.8)]">
                              "{exec.quote}"
                            </p>
                            {exec.scripture && (
                              <p className="mono-label mt-2 text-right text-[9px] text-[hsl(var(--primary))]">
                                {exec.scripture}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
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
            /* User requirement: "then the rest of the exective pictures will then be below, two image per line for mobile."
               Strict grid-cols-2 on mobile! */
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

                    {/* Card Content - carefully tailored for 2 columns on phone */}
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExec(null)}
              className="absolute inset-0 bg-[hsl(var(--foreground)/.75)] backdrop-blur-xs"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-lg border-2 border-[hsl(var(--foreground))] bg-white p-5 shadow-[8px_8px_0px_hsl(var(--foreground))] sm:p-7 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveExec(null)}
                className="absolute right-4 top-4 border-2 border-[hsl(var(--foreground))] bg-white p-1 text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] active:translate-y-0.5 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {/* Executive Photo */}
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

                {/* Profile Details */}
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

              {/* Personal Quote & Anchor Verse */}
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

              {/* Action Buttons */}
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
