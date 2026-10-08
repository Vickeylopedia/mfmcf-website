import { asc, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  galleryItemsTable,
  newsPostsTable,
  sermonsTable,
} from "@workspace/db/schema";
import { getObject } from "../lib/storage";

const router: IRouter = Router();

router.get("/sermons", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(sermonsTable)
      .orderBy(desc(sermonsTable.iso), desc(sermonsTable.id));
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/sermons/:slug", async (req, res, next) => {
  try {
    const [row] = await db
      .select()
      .from(sermonsTable)
      .where(eq(sermonsTable.slug, req.params.slug))
      .limit(1);
    if (!row) {
      res.status(404).json({ message: "Sermon not found" });
      return;
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
});

router.get("/news", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(newsPostsTable)
      .orderBy(desc(newsPostsTable.iso), desc(newsPostsTable.id));
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/gallery", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(galleryItemsTable)
      .orderBy(desc(galleryItemsTable.id));
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Stored files (artwork, audio). ?download=1 forces a download instead of
// streaming inline.
router.get("/files/*splat", async (req, res, next) => {
  try {
    const key = Array.isArray(req.params.splat)
      ? req.params.splat.join("/")
      : req.params.splat;
    if (!key || key.includes("..")) {
      res.status(400).json({ message: "Invalid file key" });
      return;
    }

    if (process.env.R2_PUBLIC_URL) {
      const publicBase = process.env.R2_PUBLIC_URL.replace(/\/+$/, "");
      const downloadParam = req.query.download === "1" ? "?download=1" : "";
      res.redirect(302, `${publicBase}/${key}${downloadParam}`);
      return;
    }

    const object = await getObject(key);
    if (!object) {
      res.status(404).json({ message: "File not found" });
      return;
    }
    res.setHeader("Content-Type", object.contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    if (req.query.download === "1") {
      const name = key.split("/").pop() ?? "download";
      res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
    }
    object.stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
