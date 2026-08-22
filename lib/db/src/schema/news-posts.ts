import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsPostsTable = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** Display date, e.g. "22 MAY 2026". */
  date: text("date").notNull(),
  /** ISO date for sorting, e.g. "2026-05-22". */
  iso: text("iso").notNull(),
  tag: text("tag").notNull(),
  /** Lead paragraph shown collapsed. */
  body: text("body").notNull(),
  /** Full note shown when expanded. */
  full: text("full").notNull(),
  /** Server-relative artwork URL (nullable when no image). */
  artworkUrl: text("artwork_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertNewsPostSchema = createInsertSchema(newsPostsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;
export type NewsPostRow = typeof newsPostsTable.$inferSelect;
