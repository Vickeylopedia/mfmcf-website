# MFMCF FUNAAB Website

Church fellowship website for the MFMCF FUNAAB chapter (Mountain of Fire and
Miracles Campus Fellowship at the Federal University of Agriculture, Abeokuta)
with a password-gated admin studio for managing sermons, news, and the
gallery without touching code.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mfmcf-funaab run dev` — run the website (requires `PORT` and `BASE_PATH` env vars; set `API_PROXY_TARGET=http://localhost:5000` to proxy `/api` to the API server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run seed` — import the built-in sermons/news/gallery content into the DB (re-run safe)
- Required env: `DATABASE_URL` — Postgres connection string; `ADMIN_PASSWORD` — password for the /admin studio (admin features return 503 until set)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Website: Vite 7, React 19, wouter, Tailwind CSS 4, TanStack Query
- API: Express 5, multer (uploads), cookie-parser (admin sessions)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Files: Replit Object Storage in production, local `uploads/` in dev

## Where things live

- Website screens: `artifacts/mfmcf-funaab/src/pages/*` (admin studio: `admin.tsx`)
- Design system: `artifacts/mfmcf-funaab/DESIGN_SYSTEM.md` + `src/components/foundation.tsx` (tokens, primitives), `src/components/reveal.tsx` (scroll reveals), `src/components/audio-player.tsx`
- Frontend data layer: `artifacts/mfmcf-funaab/src/lib/queries.ts` — live API content with built-in fallback when the API/DB is unreachable; `admin-api.ts` — multipart admin CRUD
- Content fallback data (also the seed source): `src/lib/sermons.ts`, `src/lib/queries.ts`
- DB schema: `lib/db/src/schema/*` — sermons, news_posts, gallery_items, contact_messages, newsletter_signups
- Admin auth: `artifacts/api-server/src/lib/admin-auth.ts` (HMAC cookie sessions)
- File storage: `artifacts/api-server/src/lib/storage.ts` — uploads served at `/api/files/*`, `?download=1` forces attachment
- Seed: `artifacts/api-server/src/scripts/seed.ts`

## Architecture decisions

- Content is DB-backed with a static-code fallback: if `/api/*` reads fail, pages render built-in content, so the site never goes blank (and dev works without a database)
- Admin is a single shared password in `ADMIN_PASSWORD` (no accounts); session cookies are HMAC-signed, and changing the password invalidates old sessions
- Sermon audio/artwork and gallery/news images upload through multipart admin routes into object storage (disk in dev); DB rows store server-relative `/api/files/...` URLs — seeded rows reference static `/assets/...` paths instead
- Admin mutations are hand-written (multipart is not Orval-friendly); public reads use the Orval-generated hooks
- `@replit/object-storage` is externalized in the esbuild bundle so its GCS imports stay lazy (bundling hoists them into startup and crashes off-Replit)

## Gotchas

- On Replit: after first deploy run `pnpm --filter @workspace/db run push` then `pnpm --filter @workspace/api-server run seed`, and set `ADMIN_PASSWORD` in Secrets
- The website dev server needs `PORT` and `BASE_PATH` env vars or vite.config throws
- On Windows: run vite via cmd/PowerShell (Git Bash mangles Replit plugin paths), and the pnpm-workspace overrides exclude Windows native binaries — extract esbuild/rollup/oxide/lightningcss win32 packages manually or remove the overrides
- The admin studio is unlinked from the public site — share `/admin` directly with whoever manages content
- Recording audio convention (pre-CMS): `public/assets/audio/<slug>.mp3` is still probed as a fallback by the sermon player

## Product

- Public: editorial-style homepage, about, sermon archive (index list + detail pages with audio player/download), gallery story rail, expandable news notes, contact + newsletter forms (both persisted)
- Admin (`/admin`): sign in with the admin password, then create/edit/delete sermons (title, minister, date, bible reference, description, artwork, audio), news notes (with optional artwork), and gallery photo stories

## User preferences

- Design: editorial, human, premium-through-restraint; violet + marigold palette, Fraunces/DM Sans/Space Mono, tiny radii, ghost typography, marquee, stickers, overlapping photo collages, scroll reveals (soft-expo easing, reduced-motion respected)
- The user reviews visual passes in the preview before wider rollout (design-system apply order: home + gallery first, then the rest)
- No emojis in the UI; no fake content (empty states are honest, e.g. "recording not in the archive yet")

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
