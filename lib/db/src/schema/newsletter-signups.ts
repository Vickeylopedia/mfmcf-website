import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsletterSignupsTable = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertNewsletterSignupSchema = createInsertSchema(
  newsletterSignupsTable,
).omit({ id: true, createdAt: true });
export type InsertNewsletterSignup = z.infer<
  typeof insertNewsletterSignupSchema
>;
export type NewsletterSignupRow = typeof newsletterSignupsTable.$inferSelect;
