/**
 * Static asset URLs must be prefixed with the deploy base path: Vite only
 * rewrites asset URLs it can see at build time, not runtime string literals.
 */
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

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
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];
