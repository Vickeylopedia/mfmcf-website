# MFMCF FUNAAB — Design System

Extracted from the live site (tokens in `src/index.css`, patterns in `src/pages/*`
and `src/components/layout/*`). This is the source of truth for the visual
language. The foundations in `src/components/foundation.tsx` implement the
component patterns below; screens do not consume them yet (apply pass pending
approval).

Voice: warm, editorial, human. Premium through craft and restraint — never
through gradient decoration, glassmorphism, or filler effects.

---

## 1. Principles

1. **Human first.** Real photography of the fellowship, warm copy, generous
   whitespace. Nothing that reads as template or AI-generated.
2. **Editorial rhythm.** Mono eyebrow labels announce, Fraunces display type
   declares, DM Sans body explains. Sections alternate light / tinted / dark
   backgrounds to create pace down the page.
3. **Depth through layering, not shadow.** Photo frames, floating cards,
   orbit lines, and full-bleed dark sections do the dimensional work.
   Shadows are rare and subtle (`shadow-sm`, `shadow-xl` on floating elements
   only).
4. **Restraint.** Two accents only (violet + marigold). One idea per section.
   Motion is slow, soft, and few-per-viewport.
5. **Accessible by default.** Visible focus borders, aria-labels on icon
   controls, `aria-live` announcements, `sr-only` labels, full
   `prefers-reduced-motion` support.

---

## 2. Color

All colors are HSL channel triplets consumed as `hsl(var(--token))`, defined
on `:root` (light) and `.dark` in `src/index.css`. Alpha variants use the
`hsl(var(--token) / .NN)` form.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `39 40% 96%` | `263 35% 12%` | Warm paper white |
| `--foreground` | `263 35% 18%` | `40 50% 96%` | Deep violet ink; also dark-section background (inverted) |
| `--card` | `40 50% 98%` | `263 32% 16%` | Raised surfaces |
| `--border` / `--input` | `34 28% 84%` | `263 22% 27%` | Hairlines (usually 8–18% foreground alpha instead) |
| `--primary` | `278 54% 50%` | `278 60% 66%` | Brand violet — buttons, links, active states |
| `--primary-foreground` | `40 50% 98%` | `263 35% 12%` | Text on primary |
| `--secondary` | `277 33% 91%` | `263 24% 24%` | Violet-tinted section band |
| `--secondary-foreground` | `278 54% 30%` | `40 50% 96%` | Text on secondary |
| `--muted` | `34 26% 91%` | `263 23% 22%` | Quiet fills |
| `--muted-foreground` | `263 13% 44%` | `40 18% 72%` | Secondary body text |
| `--accent` | `35 83% 65%` | `35 83% 65%` | Marigold — the single accent, unchanged in dark mode |
| `--accent-foreground` | `263 35% 18%` | `263 35% 12%` | Text on accent |
| `--ring` | `278 54% 50%` | `278 60% 66%` | Focus ring |

Usage rules:

- Body text hierarchy: foreground → `foreground/.72` (nav) → white/60–75 on
  dark → muted-foreground for paragraphs.
- Hairline dividers: `foreground/.08–.18` on light, `white/15–/25` on dark.
- Marigold is for *accents only*: eyebrows on dark sections, pulse dot, play
  badges, active gallery indicators, icon tints. Never for large fills except
  small badges/cards (`accent` background with `accent-foreground` text).
- Photo frame borders use `--primary` (8px solid) on hero imagery so photos
  sit "in front of" the violet field.

---

## 3. Typography

Fonts (Google Fonts, loaded in `index.css`): **DM Sans** 400–700 (body),
**Fraunces** 600–700 variable opsz (display), **Space Mono** 400/700 (labels).

Utility classes: `.display-font` (Fraunces), `.mono-label` (Space Mono,
uppercase, `letter-spacing: .08em`).

| Style | Class pattern | Where |
| --- | --- | --- |
| Hero display | `display-font text-6xl → lg:text-[9.2rem]` `leading-[.88]` `tracking-[-.055em]` | Home hero |
| Page display | `text-5xl sm:text-7xl lg:text-[7.5rem]` `leading-[.94]` `tracking-[-.04em]` | PageIntro h1 |
| Section display | `text-5xl sm:text-6xl` `leading-[.94–.96]` `tracking-[-.035em]` | Section h2 |
| Statement | `text-2xl sm:text-3xl leading-snug` (DM Sans) | Pull-quote paragraphs |
| Card title | `display-font text-3xl sm:text-4xl leading-none` | Event/sermon cards |
| Intro body | `text-lg leading-7` muted-foreground | PageIntro intro |
| Body | `text-sm/base leading-6/7` | Paragraphs, captions |
| Eyebrow | `mono-label text-[10px]` primary (light) or accent (dark) | Every section |
| Micro label | `mono-label text-[9px]` | Card meta, index numerals |

Italic display: `em` inside display headings uses `font-normal` and (on hero)
the accent color — the signature "Family of *Love.*" treatment.

---

## 4. Spacing, layout, shape

- **Container:** `max-w-[1380px]`, gutters `px-5` / `lg:px-10`. Narrower
  reading column `max-w-[1100px]` for news.
- **Section rhythm:** `py-16 lg:py-24` standard, `py-14 lg:py-20` dense,
  `py-20 lg:py-28` cinematic (quote section). Top padding `pt-20 lg:pt-28`
  on page intros.
- **Grids:** `lg:grid-cols-[.8fr_1.2fr]` asymmetric splits are the norm —
  text column ~0.7–0.85fr, content 1.15–1.3fr. Card grids `md:grid-cols-3`,
  sermon grid `md:grid-cols-2` with `gap-x-6 gap-y-12`.
- **Radius:** `--radius: 4px` (sm 2, md 3, lg 4). Everything is sharp;
  circles only for icon badges (`rounded-full`).
- **Photo frames:** `border-8 border-[hsl(var(--primary))]` with
  `bg-white/10` backing; aspect ratios 4/5, 1.18, 1.28, 1.35.
- **Texture:** `.site-grid` 32px hairline grid used sparingly (page intros,
  one home section).

---

## 5. Motion

Single easing curve everywhere: `cubic-bezier(.2,.8,.2,1)` ("soft expo").

| Token (planned) | Value | Use |
| --- | --- | --- |
| ease | `cubic-bezier(.2,.8,.2,1)` | All transitions/animations |
| duration-fast | `.3s–.5s` | Hovers, color fades, dot indicators |
| duration-base | `.7s` | Photo scale, gallery card depth |
| duration-slow | `1s–1.1s` | Hero staged entrances |
| delay-1/2/3 | `.1s / .2s / .3s` | Entrance stagger |

Keyframes (`index.css`): `rise-in` (entrance), `float-in` (info cards),
`hero-settle` (photo scale-down entrance), `orbit-drift` (hero orbits),
`pulse-dot` (live indicator).

Behavior rules:

- Hover: photos scale `1.035` (`.photo-shift`); gallery cards settle to
  `scale(1)` + full saturation from `.96`/`saturate(.82)`; event cards invert
  to primary fill; button arrows nudge `translate-x-0.5 -translate-y-0.5`.
- Entrances run once on mount (`.reveal`, `hero-*` classes); scroll
  reveals use the `Reveal` component (`reveal-item` + variant classes,
  IntersectionObserver adds `is-visible` once). Variants map to intent:
  headings rise (`up`), split-grid columns drift in from their side
  (`left`/`right`), photos settle (`scale`), list items stagger
  (`delay` ≤ 300ms). Reveals combine travel (44–56px), opacity, and a
  blur-to-sharp fade over `.9s`. The hero photo collage carries a gentle
  scroll parallax via `useParallax` (rAF-throttled, transform-only).
  Decorative atmosphere — large blurred accent/violet fields
  (`blur-[100–120px]`, low opacity) — sits behind hero, quote, gallery
  cinema, and sermon-detail compositions. Scroll-jacking and parallax
  libraries are deliberately avoided.
- `@media (prefers-reduced-motion: reduce)` reduces rather than removes:
  loops and hovers stop, parallax is skipped, and reveals collapse to a
  short `.25s` opacity fade (no travel, no blur). Keep every new effect
  inside this contract.

---

## 6. Component patterns

Implemented as primitives in `src/components/foundation.tsx` (not yet applied
to screens):

- **`Eyebrow`** — mono-label; `tone="primary"` on light backgrounds,
  `tone="accent"` on dark/tinted ones.
- **`SectionHeading`** — Eyebrow + Fraunces h2 block with the standard
  tracking/leading; optional `em` accent word.
- **`ActionButton` / `ActionLink`** — solid primary pill-less button with
  ArrowUpRight nudge; `inverted` variant (white/35 border) for dark fields.
- **`PhotoFrame`** — bordered photo frame with `.photo-shift` hover.

Patterns documented but composed in place (see pages):

- **Hero graphic language (home)** — the violet field is a designed
  surface, not a flat color: film grain (`.grain`), a tonal
  foreground/.16 wedge clipping the right half, a solid marigold sun
  rising behind the photo collage with two drawn concentric arcs
  (accent ring + dashed white ring), a halftone `.dot-grid-light` patch,
  a soundwave bar strip along the base (marigold every third bar,
  halved count on phones), vertical spine caption (`.spine-text`,
  xl-only), and registration plus-marks. The headline carries a
  marigold marker swipe under its first line and the eyebrow sits in a
  bordered chip. The hero is deliberately maximal; every other section
  keeps to one or two editorial elements. On stacked (below-lg)
  layouts the sun and arcs drop to the collage zone so they never sit
  behind the headline.
- **Editorial layer** — oversized background words (`.ghost-word`,
  Fraunces at ~20vw, `foreground/.055` or light/accent variants, desktop
  only, clipped by their section), the `Marquee` band (mono labels +
  asterisks scrolling on an accent/primary/foreground strip), `.dot-grid`
  texture patches, and rotated `.sticker` badges (solid accent chips with
  soft shadow) overlapping photos and statements. About's story section
  composes these as an overlapping collage: polaroid-framed photo, tilted
  inset photo, corner sticker. One or two editorial elements per section,
  never all at once.
- **Header (floating glass bar)** — fixed overlay, inset from all edges,
  `rounded-2xl`, gradient background (`background/.95 → /.8` top-to-bottom)
  over `backdrop-blur-xl`, thin foreground/10 border, soft shadow. Floats
  over the hero (page content starts at y=0; page tops carry clearance
  padding). Logo tile (white frame, hover rotate-3), mono chapter lockup,
  nav links with scale-x underline, outline CONNECT button. Mobile menu is
  a matching floating dropdown panel (`rounded-xl`, same blur treatment)
  with pill hover rows. The page wrapper uses `overflow-x-clip` (not
  `hidden`, which breaks sticky).
- **Hero collage** — main + secondary framed photos, floating info card
  (foreground fill), accent spark badge, two orbit rings, radial atmosphere.
- **EventCard** — day tag + calendar icon, display title, hairline footer
  with clock; whole card inverts to primary on hover.
- **SermonCard / sermon rows** — framed cover with accent play badge, mono
  meta (`tag · date`), display title, "Listen" arrow link.
- **Gallery cinema** — dark section, snap rail of 82vw→620px cards,
  `is-active` depth + shade gradient, mono index numerals, bar-dot progress,
  filter chips (accent fill when active).
- **News rows** — mono date column / display title / right-aligned tag,
  hairline top borders.
- **Forms** — square bordered inputs, `bg-transparent` on card, focus swaps
  border to primary; submit buttons solid primary with icon; error text
  `text-red-600` with `role="alert"`.
- **Footer** — full foreground inversion, marigold mono accents, social
  icon links, white/15 hairlines.

---

## 7. Application guide

When applying the system to screens:

1. Replace inline eyebrow/heading/button/photo-frame class strings with the
   foundation primitives — visual output must be identical.
2. Move hardcoded easings/durations in `index.css` to `--ease`,
   `--duration-*` custom properties.
3. New sections must choose: which background tier (light / secondary /
   foreground), which eyebrow tone, and one motion moment maximum.
4. Never introduce a third accent color, a radius above 4px (badges and the
   floating header/menu pills excepted), or an emoji.
