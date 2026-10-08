import { useEffect, useState, type ReactNode } from "react";
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

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on Escape key press
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="min-h-[100dvh] overflow-x-clip">
      <header className="fixed inset-x-0 top-2 z-40 px-3 lg:top-3 lg:px-6">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex items-center justify-between border-2 border-[hsl(var(--foreground))] border-t-4 border-t-[hsl(var(--accent))] bg-[hsl(var(--card))] px-4 py-3 sm:px-8 shadow-[4px_4px_0px_hsl(var(--foreground))]">
            <Link
              href="/"
              data-testid="link-logo-home"
              className="group flex items-center gap-3"
            >
              <span className="relative flex size-11 items-center justify-center overflow-hidden border-2 border-[hsl(var(--foreground))] bg-white shadow-[2px_2px_0px_hsl(var(--foreground))] transition-transform group-hover:-rotate-3">
                <img
                  src={logo}
                  alt="MFMCF FUNAAB logo"
                  className="size-10 object-contain"
                  data-testid="img-header-logo"
                />
              </span>
              <span className="hidden leading-none sm:block">
                <span className="block text-sm font-black tracking-[.18em] text-[hsl(var(--primary))]">
                  MFMCF
                </span>
                <span className="mt-1 block text-[10px] font-bold tracking-[.14em] text-[hsl(var(--foreground)/.75)]">
                  FUNAAB CHAPTER
                </span>
              </span>
            </Link>
            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Primary navigation"
            >
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
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                data-testid="link-header-connect"
                className="hidden border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-5 py-2 text-xs font-black tracking-[.12em] text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:block"
              >
                CONNECT <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                data-testid="button-mobile-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="border-2 border-[hsl(var(--foreground))] bg-white p-2 text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] lg:hidden"
              >
                {menuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-nav-panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="mx-auto mt-2 max-w-[1380px] rounded-none border-2 border-[hsl(var(--foreground))] border-t-4 border-t-[hsl(var(--accent))] bg-[hsl(var(--card))] p-3 shadow-[4px_4px_0px_hsl(var(--foreground))] lg:hidden"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.15 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                    className="flex items-center justify-between rounded-none border-b border-[hsl(var(--foreground)/.1)] px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] sm:px-5"
                  >
                    {item.label}
                    <ArrowUpRight className="size-4 text-[hsl(var(--primary))]" />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
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
            <p>© 2026 MFMCF FUNAAB. Family of Love.</p>
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
