import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sermonsTable = pgTable("sermons", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  speaker: text("speaker").notNull(),
  /** Display date, e.g. "May 18, 2026". */
  date: text("date").notNull(),
  /** ISO date for sorting, e.g. "2026-05-18". */
  iso: text("iso").notNull(),
  tag: text("tag").notNull(),
  scripture: text("scripture").notNull(),
  /** Description paragraphs, in order. */
  summary: jsonb("summary").$type<string[]>().notNull(),
  /** Server-relative artwork URL (nullable until an image is uploaded). */
  artworkUrl: text("artwork_url"),
  /** Server-relative audio URL; null means the recording is not in yet. */
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertSermonSchema = createInsertSchema(sermonsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type SermonRow = typeof sermonsTable.$inferSelect;
