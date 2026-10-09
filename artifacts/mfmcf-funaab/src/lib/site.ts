import { Facebook, Instagram, Youtube } from "lucide-react";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://mfmcf-funaab-api.onrender.com" : "")
).replace(/\/+$/, "");

/**
 * Static asset URLs must be prefixed with the deploy base path: Vite only
 * rewrites asset URLs it can see at build time, not runtime string literals.
 */
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

/**
 * Resolves media URLs (uploaded artwork, audio, gallery photos):
 * - If already absolute (http:, https:, data:, blob:) -> return as-is
 * - If backend file path (/api/...) -> prepend API_BASE_URL
 * - If frontend static asset (/assets/...) -> use withBase()
 */
export const resolveMediaUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith("/api/")) {
    return `${API_BASE_URL}${url}`;
  }
  return withBase(url);
};

export const logo = withBase("/assets/mfmcf_funaab_logo_no_bg.png");

export const photos = {
  gathering: withBase("/assets/image_1787352840643.png"),
  worship: withBase("/assets/image_1787352852059.png"),
  joy: withBase("/assets/image_1787352917176.png"),
  prayer: withBase("/assets/image_1787353043632.png"),
  word: withBase("/assets/image_1787353067577.png"),
  community: withBase("/assets/fellowship-community.jpg"),
  fellowshipWorship: withBase("/assets/fellowship-worship.jpg"),
  students: withBase("/assets/fellowship-students.jpg"),
  service: withBase("/assets/fellowship-gathering.jpg"),
  sundayPraise: withBase("/assets/gallery-sunday-praise.jpg"),
  prayerFervent: withBase("/assets/gallery-prayer-fervent.jpg"),
  familyUnity: withBase("/assets/gallery-family-unity.jpg"),
  fellowshipJoy: withBase("/assets/gallery-fellowship-joy.jpg"),
  preachingWord: withBase("/assets/gallery-preaching-word.jpg"),
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/alumni", label: "Alumni" },
  { href: "/contact", label: "Contact" },
];

/**
 * Fellowship social profiles. Replace the placeholder hrefs with the real
 * account URLs when available — the footer renders whatever lives here.
 */
export const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    testId: "link-footer-instagram",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    testId: "link-footer-youtube",
    icon: Youtube,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    testId: "link-footer-facebook",
    icon: Facebook,
  },
];
