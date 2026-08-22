import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu,
  X,
  Youtube,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { logo, navItems } from "@/lib/site";

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
  return (
    <div className="min-h-[100dvh] overflow-x-hidden">
      <div className="announcement-bar border-b border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--primary))] px-4 py-2 text-center text-[10px] font-semibold tracking-[.18em] text-white sm:text-xs">
        <span
          className="pulse-dot mr-2 inline-block size-1.5 rounded-full bg-[hsl(var(--accent))] align-middle"
          aria-hidden="true"
        />
        SUNDAY GATHERING · 9:00 AM · FUNAAB CAMPUS
        <span className="hidden text-white/55 sm:inline">
          {" "}
          · FAMILY OF LOVE
        </span>
      </div>
      <header className="relative z-30 border-b border-[hsl(var(--foreground)/.1)] bg-[hsl(var(--background)/.9)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-4 lg:px-10">
          <Link
            href="/"
            data-testid="link-logo-home"
            className="group flex items-center gap-3"
          >
            <span className="relative flex size-11 items-center justify-center overflow-hidden border border-[hsl(var(--primary)/.28)] bg-white shadow-sm transition-transform group-hover:-rotate-3">
              <img
                src={logo}
                alt="MFMCF FUNAAB logo"
                className="size-10 object-contain"
                data-testid="img-header-logo"
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-sm font-bold tracking-[.16em] text-[hsl(var(--primary))]">
                MFMCF
              </span>
              <span className="mt-1 block text-[10px] font-medium tracking-[.12em] text-[hsl(var(--muted-foreground))]">
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
                className={`relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-[hsl(var(--primary))] after:transition-transform hover:text-[hsl(var(--primary))] hover:after:scale-x-100 ${
                  location === item.href
                    ? "text-[hsl(var(--primary))] after:scale-x-100"
                    : "text-[hsl(var(--foreground)/.72)]"
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
              className="hidden border border-[hsl(var(--primary)/.32)] px-4 py-2 text-xs font-bold tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-white sm:block"
            >
              CONNECT <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              data-testid="button-mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="border border-[hsl(var(--foreground)/.14)] p-2 text-[hsl(var(--foreground))] lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-[hsl(var(--foreground)/.1)] bg-[hsl(var(--card))] px-5 py-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                className="flex items-center justify-between border-b border-[hsl(var(--foreground)/.08)] py-4 text-sm font-semibold last:border-0"
              >
                {item.label}
                <ArrowUpRight className="size-4 text-[hsl(var(--primary))]" />
              </Link>
            ))}
          </nav>
        )}
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
              {navItems.slice(1, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-footer-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  className="w-fit transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
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
        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© 2026 MFMCF FUNAAB. Family of Love.</p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              data-testid="link-footer-instagram"
              className="transition hover:text-white"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              data-testid="link-footer-youtube"
              className="transition hover:text-white"
            >
              <Youtube className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              data-testid="link-footer-facebook"
              className="transition hover:text-white"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
