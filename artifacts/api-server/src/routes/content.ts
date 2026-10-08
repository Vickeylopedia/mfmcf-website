import { asc, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  galleryItemsTable,
  newsPostsTable,
  sermonsTable,
} from "@workspace/db/schema";
import { getObject, getObjectInfo, getObjectStream } from "../lib/storage";

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

// Stored files (artwork, audio). Supports full streaming and HTTP Range
// requests (206 Partial Content) for seeking in HTML5 audio/video players.
// ?download=1 forces a download attachment header.
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

    const info = await getObjectInfo(key);
    if (!info) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    const { size, contentType } = info;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (req.query.download === "1") {
      const name = key.split("/").pop() ?? "download";
      res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
    }

    const rangeHeader = req.headers.range;
    if (rangeHeader && size > 0) {
      const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
      if (match) {
        let start = match[1] ? parseInt(match[1], 10) : 0;
        let end = match[2] ? parseInt(match[2], 10) : size - 1;
        if (Number.isNaN(start) || start < 0) start = 0;
        if (Number.isNaN(end) || end >= size) end = size - 1;

        if (start > end || start >= size) {
          res.setHeader("Content-Range", `bytes */${size}`);
          res.status(416).end();
          return;
        }

        const chunkSize = end - start + 1;
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
        res.setHeader("Content-Length", chunkSize);

        const chunkStream = await getObjectStream(key, { start, end });
        if (!chunkStream) {
          res.status(404).end();
          return;
        }
        chunkStream.pipe(res);
        return;
      }
    }

    if (size > 0) {
      res.setHeader("Content-Length", size);
    }
    const fullStream = await getObjectStream(key);
    if (!fullStream) {
      res.status(404).end();
      return;
    }
    fullStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
