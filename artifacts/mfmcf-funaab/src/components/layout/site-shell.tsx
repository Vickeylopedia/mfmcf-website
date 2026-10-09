import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Lock,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { logo, navItems, socials } from "@/lib/site";

export function ButtonLink({
  href,
  children,
  inverted = false,
}: {
  href: string;
  children: ReactNode;
  inverted?: boolean;
}) {
  return (
    <Link
      href={href}
      data-testid={`link-${href.slice(1) || "home"}-cta`}
      className={`group inline-flex items-center gap-3 border px-5 py-3 text-sm font-semibold transition-colors ${
        inverted
          ? "border-white/35 text-white hover:bg-white hover:text-[hsl(var(--primary))]"
          : "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white hover:bg-transparent hover:text-[hsl(var(--primary))]"
      }`}
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

/** Wouter keeps the scroll offset across navigations; reset it per page. */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

type HeaderBoxState =
  | "expanded"
  | "shrinking-width"
  | "shrinking-square"
  | "minimized"
  | "emerging-square"
  | "lengthening-width";

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 45);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on location change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close menu on Escape key press
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const isExpandedTarget = !isScrolled || menuOpen;
  const [boxState, setBoxState] = useState<HeaderBoxState>(() =>
    typeof window !== "undefined" && window.scrollY > 45 ? "minimized" : "expanded"
  );
  const animTimeouts = useRef<number[]>([]);
  const isFirstMount = useRef(true);

  const clearTimeouts = () => {
    animTimeouts.current.forEach((t) => window.clearTimeout(t));
    animTimeouts.current = [];
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    clearTimeouts();

    if (!isExpandedTarget) {
      // ── MINIMIZING ANIMATION ──
      // 1. Shrink width ONLY from the menu side to the logo
      setBoxState("shrinking-width");

      const t1 = window.setTimeout(() => {
        // 2. When it forms a perfect square (68px) around the logo,
        // shrink all sides at the same time to the back of the logo till invisible
        setBoxState("shrinking-square");

        const t2 = window.setTimeout(() => {
          setBoxState("minimized");
        }, 220);
        animTimeouts.current.push(t2);
      }, 380);
      animTimeouts.current.push(t1);
    } else {
      // ── MAXIMIZING ANIMATION ──
      if (boxState === "shrinking-width") {
        // If it was only partially shrinking its width, lengthen back to full
        setBoxState("lengthening-width");
        const t = window.setTimeout(() => {
          setBoxState("expanded");
        }, 380);
        animTimeouts.current.push(t);
      } else {
        // 1. Come out from the back of the logo, forming the same square (68px)
        setBoxState("emerging-square");

        const t1 = window.setTimeout(() => {
          // 2. Lengthen right side back to the menu side forming normal length
          setBoxState("lengthening-width");

          const t2 = window.setTimeout(() => {
            setBoxState("expanded");
          }, 380);
          animTimeouts.current.push(t2);
        }, 220);
        animTimeouts.current.push(t1);
      }
    }

    return clearTimeouts;
  }, [isExpandedTarget]);

  const getBoxStyle = (state: HeaderBoxState): CSSProperties => {
    const base: CSSProperties = {
      position: "absolute",
      left: 0,
      top: 0,
      height: "68px",
      transformOrigin: "34px 34px",
      boxSizing: "border-box",
    };

    switch (state) {
      case "expanded":
        return {
          ...base,
          width: "100%",
          transform: "scale(1)",
          opacity: 1,
        };
      case "shrinking-width":
        return {
          ...base,
          width: "68px",
          transform: "scale(1)",
          opacity: 1,
          transition: "width 380ms cubic-bezier(0.4, 0, 0.2, 1)",
        };
      case "shrinking-square":
        return {
          ...base,
          width: "68px",
          transform: "scale(0)",
          opacity: 0,
          transition:
            "transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease",
        };
      case "minimized":
        return {
          ...base,
          width: "68px",
          transform: "scale(0)",
          opacity: 0,
          pointerEvents: "none",
        };
      case "emerging-square":
        return {
          ...base,
          width: "68px",
          transform: "scale(1)",
          opacity: 1,
          transition:
            "transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease",
        };
      case "lengthening-width":
        return {
          ...base,
          width: "100%",
          transform: "scale(1)",
          opacity: 1,
          transition: "width 380ms cubic-bezier(0.16, 1, 0.3, 1)",
        };
    }
  };

  return (
    <div className="min-h-[100dvh] overflow-x-clip">
      <header className="fixed inset-x-0 top-2 z-40 px-3 lg:top-3 lg:px-6 pointer-events-none">
        <div className="mx-auto max-w-[1380px] pointer-events-auto relative h-[68px]">
          {/* ── 1. ANIMATED HEADER BOX (SHRINKS MENU->LOGO SQUARE, THEN INTO BACK OF LOGO) ── */}
          <div
            aria-hidden="true"
            style={getBoxStyle(boxState)}
            className="border-2 border-[hsl(var(--foreground))] border-t-4 border-t-[hsl(var(--accent))] bg-[hsl(var(--card))] shadow-[4px_4px_0px_hsl(var(--foreground))]"
          />

          {/* ── 2. LOGO (PINNED AT FAR LEFT IN NORMAL POSITION, NEVER MOVES TO MIDDLE) ── */}
          <div className="absolute left-0 top-0 h-[68px] w-[68px] z-20 flex items-center justify-center">
            <Link
              href="/"
              data-testid="link-logo-home"
              className="group flex size-11 items-center justify-center overflow-hidden border-2 border-[hsl(var(--foreground))] bg-white shadow-[2px_2px_0px_hsl(var(--foreground))] transition-transform hover:-rotate-3 active:scale-95"
            >
              <img
                src={logo}
                alt="MFMCF FUNAAB logo"
                className="size-10 object-contain"
                data-testid="img-header-logo"
              />
            </Link>
          </div>

          {/* ── 3. LOGO TEXT BRANDING (FADES OUT WHEN MINIMIZING) ── */}
          <div
            className={`absolute left-[70px] top-0 h-[68px] z-20 hidden sm:flex flex-col justify-center leading-none transition-opacity duration-200 ${
              isExpandedTarget && boxState === "expanded"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Link href="/" className="group">
              <span className="block text-sm font-black tracking-[.18em] text-[hsl(var(--primary))]">
                MFMCF
              </span>
              <span className="mt-1 block text-[10px] font-bold tracking-[.14em] text-[hsl(var(--foreground)/.75)]">
                FUNAAB CHAPTER
              </span>
            </Link>
          </div>

          {/* ── 4. DESKTOP NAV LINKS (CENTERED, FADES OUT WHEN MINIMIZING) ── */}
          <div
            className={`absolute inset-x-[220px] top-0 h-[68px] z-20 hidden lg:flex items-center justify-center transition-opacity duration-200 ${
              isExpandedTarget && boxState === "expanded"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <nav className="flex items-center gap-1" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-nav-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  className={`relative px-3.5 py-2 font-mono text-[11px] font-black uppercase tracking-[.14em] transition-colors hover:text-[hsl(var(--primary))] ${
                    location === item.href
                      ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]"
                      : "text-[hsl(var(--foreground))]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── 5. RIGHT SIDE ACTIONS: CONNECT BUTTON & PINNED MENU BUTTON ── */}
          <div className="absolute right-0 top-0 h-[68px] z-20 flex items-center pr-2 sm:pr-4 gap-2.5">
            <Link
              href="/contact"
              data-testid="link-header-connect"
              className={`hidden sm:inline-flex border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-4 py-2 text-xs font-black tracking-[.12em] text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-opacity duration-200 ${
                isExpandedTarget && boxState === "expanded"
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              CONNECT <span aria-hidden="true">→</span>
            </Link>

            {/* Menu button pinned at far right in normal position */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              data-testid="button-site-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="border-2 border-[hsl(var(--foreground))] bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              {menuOpen ? (
                <X className="size-4 text-[hsl(var(--primary))]" />
              ) : (
                <Menu className="size-4" />
              )}
              <span className="font-mono text-xs font-black tracking-wider uppercase">
                {menuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </div>

        {/* ── 6. EXPANDED MENU MODAL (RESTORED TO PREVIOUS DESIGN) ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="header-maximized"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="mx-auto mt-2 max-w-[820px] w-full pointer-events-auto border-2 border-[hsl(var(--foreground))] border-t-4 border-t-[hsl(var(--accent))] bg-[hsl(var(--card))] p-4 sm:p-6 shadow-[6px_6px_0px_hsl(var(--foreground))]"
            >
              <div className="flex items-center justify-between border-b border-[hsl(var(--foreground)/.15)] pb-3">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="flex size-10 items-center justify-center border-2 border-[hsl(var(--foreground))] bg-white shadow-[2px_2px_0px_hsl(var(--foreground))]">
                    <img src={logo} alt="MFMCF logo" className="size-9 object-contain" />
                  </span>
                  <div>
                    <span className="block text-sm font-black tracking-[.18em] text-[hsl(var(--primary))]">
                      MFMCF FUNAAB
                    </span>
                    <span className="block font-mono text-[9px] font-bold tracking-[.14em] text-[hsl(var(--foreground)/.7)]">
                      FAMILY OF LOVE, WORD AND POWER
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="border-2 border-[hsl(var(--foreground))] bg-white p-2 text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-[hsl(var(--accent))] cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Maximized navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    data-testid={`link-drawer-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                    className={`flex items-center justify-between border border-[hsl(var(--foreground)/.18)] p-3 font-mono text-xs font-black uppercase tracking-wider transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] ${
                      location === item.href
                        ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                        : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--foreground)/.12)] pt-3">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  data-testid="link-drawer-connect"
                  className="w-full text-center border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] py-2.5 font-mono text-xs font-black uppercase tracking-widest text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:bg-white"
                >
                  Connect with us <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[hsl(var(--foreground))] px-5 pb-8 pt-16 text-[hsl(var(--background))] lg:px-10">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.4fr_.8fr_.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center bg-white">
                <img
                  src={logo}
                  alt="MFMCF FUNAAB logo"
                  className="size-11 object-contain"
                />
              </div>
              <div>
                <p className="font-bold tracking-[.16em] text-white">MFMCF</p>
                <p className="mono-label mt-1 text-[9px] text-white/55">
                  FUNAAB CHAPTER
                </p>
              </div>
            </div>
            <p className="display-font mt-7 max-w-sm text-3xl leading-[1.05] text-white">
              There is room for you here.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              A campus family learning to love God, love people, and live awake
              to His presence.
            </p>
          </div>
          <div>
            <p className="mono-label text-[10px] text-[hsl(var(--accent))]">
              Explore
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/70">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-footer-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  className="w-fit transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin"
                data-testid="link-footer-explore-admin"
                className="w-fit inline-flex items-center gap-1.5 text-white/50 transition hover:text-white"
              >
                <Lock className="size-3 text-[hsl(var(--accent))]" />
                Admin Portal
              </Link>
            </div>
          </div>
          <div>
            <p className="mono-label text-[10px] text-[hsl(var(--accent))]">
              Find us
            </p>
            <div className="mt-5 space-y-3 text-sm leading-5 text-white/70">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[hsl(var(--accent))]" />
                FUNAAB Campus
                <br />
                Abeokuta, Ogun State
              </p>
              <p className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-[hsl(var(--accent))]" />
                mfmcf.funaab@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <p>© 2026 MFMCF FUNAAB. Family of Love, Word and Power.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link
              href="/admin"
              data-testid="link-footer-admin-bottom"
              className="inline-flex items-center gap-1.5 text-white/50 transition hover:text-[hsl(var(--accent))]"
            >
              <Lock className="size-3" />
              <span>Admin Studio</span>
            </Link>
          </div>
          <div className="flex gap-4">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  data-testid={social.testId}
                  className="transition hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div className="mt-12 overflow-hidden" aria-hidden="true">
          <p className="display-font -mb-[.16em] select-none text-center text-[22vw] leading-[.82] tracking-[-.04em] text-white/5">
            MFMCF
          </p>
        </div>
      </div>
    </footer>
  );
}
