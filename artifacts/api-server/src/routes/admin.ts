import crypto from "node:crypto";
import { eq, sql } from "drizzle-orm";
import multer from "multer";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  galleryItemsTable,
  newsPostsTable,
  sermonsTable,
} from "@workspace/db/schema";
import { logger } from "../lib/logger";
import { deleteObject, fileUrl, putObject } from "../lib/storage";
import {
  ADMIN_COOKIE,
  checkPassword,
  getTokenFromRequest,
  isAdminConfigured,
  issueToken,
  requireAdmin,
  verifyToken,
} from "../lib/admin-auth";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024, files: 2 },
});

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "video/mp4", // some exporters tag .m4a this way
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/mp4": ".m4a",
  "audio/aac": ".aac",
  "audio/ogg": ".ogg",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "video/mp4": ".m4a",
};

function fileErrorMessage(field: string): string {
  return `${field} must be an image (jpg, png, webp, gif)`;
}

async function storeUpload(
  file: Express.Multer.File | undefined,
  folder: string,
  allowed: Set<string>,
  label: string,
): Promise<string | null> {
  if (!file) return null;
  if (!allowed.has(file.mimetype)) {
    throw new ValidationError(fileErrorMessage(label));
  }
  const ext = EXT_BY_TYPE[file.mimetype] ?? "";
  const key = `${folder}/${crypto.randomBytes(8).toString("hex")}${ext}`;
  await putObject(key, file.buffer);
  return fileUrl(key);
}

/** Removes the stored object behind a /api/files URL, if it is one. */
async function removeStoredFile(url: string | null): Promise<void> {
  if (!url?.startsWith("/api/files/")) return;
  await deleteObject(url.slice("/api/files/".length));
}

class ValidationError extends Error {}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "sermon";

async function uniqueSlug(title: string, ignoreId?: number): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let n = 2;
  for (;;) {
    const [row] = await db
      .select({ id: sermonsTable.id })
      .from(sermonsTable)
      .where(eq(sermonsTable.slug, candidate))
      .limit(1);
    if (!row || row.id === ignoreId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

/** Splits a description into paragraphs on blank lines. */
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const displayDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

// --- Session -----------------------------------------------------------------

router.post("/admin/login", (req, res) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ message: "Admin access is not configured" });
    return;
  }
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || !checkPassword(password)) {
    // Constant-ish response delay blunts trivial timing probes.
    setTimeout(() => res.status(401).json({ message: "Incorrect password" }), 400);
    return;
  }
  const token = issueToken();
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ authenticated: true, token });
});

router.post("/admin/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(ADMIN_COOKIE, {
    path: "/",
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
  res.json({ authenticated: false });
});

router.get("/admin/session", (req, res) => {
  const token = getTokenFromRequest(req);
  const authenticated =
    isAdminConfigured() && verifyToken(token);
  res.json({ authenticated, configured: isAdminConfigured() });
});

// --- Sermons -----------------------------------------------------------------

const sermonText = (req: RequestLike, key: string) =>
  typeof req.body?.[key] === "string" ? (req.body[key] as string).trim() : "";

interface RequestLike {
  body?: Record<string, unknown>;
}

async function readSermonFields(req: RequestLike) {
  const title = sermonText(req, "title");
  const speaker = sermonText(req, "speaker");
  const iso = sermonText(req, "iso");
  const tag = sermonText(req, "tag") || "Teaching";
  const scripture = sermonText(req, "scripture");
  const description = sermonText(req, "description");
  if (!title) throw new ValidationError("Title is required");
  if (!speaker) throw new ValidationError("Minister is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso))
    throw new ValidationError("A valid date is required");
  if (!scripture) throw new ValidationError("Bible reference is required");
  if (!description) throw new ValidationError("Description is required");
  return {
    title,
    speaker,
    iso,
    tag,
    scripture,
    date: displayDate(iso),
    summary: paragraphs(description),
  };
}

type SermonFiles = { artwork?: Express.Multer.File[]; audio?: Express.Multer.File[] };

router.post(
  "/admin/sermons",
  requireAdmin,
  upload.fields([{ name: "artwork", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const fields = await readSermonFields(req);
      const files = req.files as SermonFiles | undefined;
      const artworkUrl = await storeUpload(
        files?.artwork?.[0],
        "sermons/artwork",
        IMAGE_TYPES,
        "Artwork",
      );
      const audioUrl = await storeUpload(
        files?.audio?.[0],
        "sermons/audio",
        AUDIO_TYPES,
        "Audio",
      );
      const slug = await uniqueSlug(fields.title);
      const [row] = await db
        .insert(sermonsTable)
        .values({ ...fields, slug, artworkUrl, audioUrl })
        .returning();
      res.status(201).json(row);
    } catch (error) {
      handleRouteError(error, res, next);
    }
  },
);

router.put(
  "/admin/sermons/:id",
  requireAdmin,
  upload.fields([{ name: "artwork", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const [existing] = await db
        .select()
        .from(sermonsTable)
        .where(eq(sermonsTable.id, id))
        .limit(1);
      if (!existing) {
        res.status(404).json({ message: "Sermon not found" });
        return;
      }
      const fields = await readSermonFields(req);
      const files = req.files as SermonFiles | undefined;
      const artworkUrl =
        (await storeUpload(files?.artwork?.[0], "sermons/artwork", IMAGE_TYPES, "Artwork")) ??
        existing.artworkUrl;
      const newAudioUrl = await storeUpload(
        files?.audio?.[0],
        "sermons/audio",
        AUDIO_TYPES,
        "Audio",
      );
      if (newAudioUrl) await removeStoredFile(existing.audioUrl);
      const slug =
        fields.title === existing.title
          ? existing.slug
          : await uniqueSlug(fields.title, id);
      const [row] = await db
        .update(sermonsTable)
        .set({ ...fields, slug, artworkUrl, audioUrl: newAudioUrl ?? existing.audioUrl })
        .where(eq(sermonsTable.id, id))
        .returning();
      res.json(row);
    } catch (error) {
      handleRouteError(error, res, next);
    }
  },
);

router.delete("/admin/sermons/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [row] = await db
      .delete(sermonsTable)
      .where(eq(sermonsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ message: "Sermon not found" });
      return;
    }
    await removeStoredFile(row.artworkUrl);
    await removeStoredFile(row.audioUrl);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

// --- News --------------------------------------------------------------------

interface NewsFields {
  title: string;
  iso: string;
  tag: string;
  date: string;
  body: string;
  full: string;
}

async function readNewsFields(req: RequestLike): Promise<NewsFields> {
  const title = sermonText(req, "title");
  const iso = sermonText(req, "iso");
  const tag = sermonText(req, "tag") || "Family";
  const body = sermonText(req, "body");
  const full = sermonText(req, "full");
  if (!title) throw new ValidationError("Title is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso))
    throw new ValidationError("A valid date is required");
  if (!body) throw new ValidationError("Lead text is required");
  if (!full) throw new ValidationError("Content is required");
  return {
    title,
    iso,
    tag,
    body,
    full,
    date: iso
      ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          timeZone: "UTC",
        })
          .replace(",", "")
          .toUpperCase()
      : "",
  };
}

router.post(
  "/admin/news",
  requireAdmin,
  upload.single("artwork"),
  async (req, res, next) => {
    try {
      const fields = await readNewsFields(req);
      const artworkUrl = await storeUpload(
        req.file,
        "news/artwork",
        IMAGE_TYPES,
        "Artwork",
      );
      const [row] = await db
        .insert(newsPostsTable)
        .values({ ...fields, artworkUrl })
        .returning();
      res.status(201).json(row);
    } catch (error) {
      handleRouteError(error, res, next);
    }
  },
);

router.put(
  "/admin/news/:id",
  requireAdmin,
  upload.single("artwork"),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const [existing] = await db
        .select()
        .from(newsPostsTable)
        .where(eq(newsPostsTable.id, id))
        .limit(1);
      if (!existing) {
        res.status(404).json({ message: "News note not found" });
        return;
      }
      const fields = await readNewsFields(req);
      const newArtwork = await storeUpload(
        req.file,
        "news/artwork",
        IMAGE_TYPES,
        "Artwork",
      );
      if (newArtwork) await removeStoredFile(existing.artworkUrl);
      const [row] = await db
        .update(newsPostsTable)
        .set({ ...fields, artworkUrl: newArtwork ?? existing.artworkUrl })
        .where(eq(newsPostsTable.id, id))
        .returning();
      res.json(row);
    } catch (error) {
      handleRouteError(error, res, next);
    }
  },
);

router.delete("/admin/news/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [row] = await db
      .delete(newsPostsTable)
      .where(eq(newsPostsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ message: "News note not found" });
      return;
    }
    await removeStoredFile(row.artworkUrl);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

// --- Gallery -----------------------------------------------------------------

const GALLERY_TYPES = ["Worship", "Community", "Teaching"];

router.post(
  "/admin/gallery",
  requireAdmin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const title = sermonText(req, "title");
      const type = sermonText(req, "type") || "Community";
      const desc = sermonText(req, "desc");
      if (!title) throw new ValidationError("Title is required");
      if (!GALLERY_TYPES.includes(type))
        throw new ValidationError("Category must be Worship, Community, or Teaching");
      if (!desc) throw new ValidationError("Description is required");
      if (!req.file) throw new ValidationError("An image is required");
      const imageUrl = (await storeUpload(
        req.file,
        "gallery",
        IMAGE_TYPES,
        "Image",
      )) as string;
      const [{ nextPosition }] = await db
        .select({
          nextPosition: sql<number>`coalesce(max(${galleryItemsTable.position}), 0) + 1`,
        })
        .from(galleryItemsTable);
      const [row] = await db
        .insert(galleryItemsTable)
        .values({ title, type, desc, imageUrl, position: nextPosition })
        .returning();
      res.status(201).json(row);
    } catch (error) {
      handleRouteError(error, res, next);
    }
  },
);

router.put(
  "/admin/gallery/:id",
  requireAdmin,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const [existing] = await db
        .select()
        .from(galleryItemsTable)
        .where(eq(galleryItemsTable.id, id))
        .limit(1);
      if (!existing) {
        res.status(404).json({ message: "Gallery item not found" });
        return;
      }
      const title = sermonText(req, "title") || existing.title;
      const type = sermonText(req, "type") || existing.type;
      const desc = sermonText(req, "desc") || existing.desc;
      if (!GALLERY_TYPES.includes(type))
        throw new ValidationError("Category must be Worship, Community, or Teaching");
      const newImage = await storeUpload(
        req.file,
        "gallery",
        IMAGE_TYPES,
        "Image",
      );
      if (newImage) await removeStoredFile(existing.imageUrl);
      const [row] = await db
        .update(galleryItemsTable)
        .set({ title, type, desc, imageUrl: newImage ?? existing.imageUrl })
        .where(eq(galleryItemsTable.id, id))
        .returning();
      res.json(row);
    } catch (error) {
      handleRouteError(error, res, next);
    }
  },
);

router.delete("/admin/gallery/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [row] = await db
      .delete(galleryItemsTable)
      .where(eq(galleryItemsTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ message: "Gallery item not found" });
      return;
    }
    await removeStoredFile(row.imageUrl);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

function handleRouteError(error: unknown, res: import("express").Response, next: NextFn) {
  if (error instanceof ValidationError) {
    res.status(400).json({ message: error.message });
    return;
  }
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is too large (audio limit 60MB, images 60MB)"
        : `Upload error: ${error.message}`;
    res.status(400).json({ message });
    return;
  }
  logger.error({ err: error }, "Admin route error");
  next(error);
}

type NextFn = (err: unknown) => void;

export default router;
