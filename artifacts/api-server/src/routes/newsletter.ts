import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  SubscribeNewsletterBody,
  SubscribeNewsletterResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import { newsletterSignupsTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/newsletter", async (req, res, next) => {
  try {
    const parsed = SubscribeNewsletterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid newsletter signup",
        issues: parsed.error.issues,
      });
      return;
    }

    // Resubscribing is a no-op: return the existing row instead of erroring.
    const inserted = await db
      .insert(newsletterSignupsTable)
      .values(parsed.data)
      .onConflictDoNothing({ target: newsletterSignupsTable.email })
      .returning();
    const row =
      inserted[0] ??
      (
        await db
          .select()
          .from(newsletterSignupsTable)
          .where(eq(newsletterSignupsTable.email, parsed.data.email))
          .limit(1)
      )[0];

    res.status(201).json(SubscribeNewsletterResponse.parse(row));
  } catch (error) {
    next(error);
  }
});

export default router;
