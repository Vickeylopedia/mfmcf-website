import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryItemsTable = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  /** Category: Worship, Community, or Teaching. */
  type: text("type").notNull(),
  desc: text("desc").notNull(),
  /** Server-relative image URL. */
  imageUrl: text("image_url").notNull(),
  /** Sort order, ascending. */
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertGalleryItemSchema = createInsertSchema(
  galleryItemsTable,
).omit({ id: true, createdAt: true });
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItemRow = typeof galleryItemsTable.$inferSelect;
