import { Router, type IRouter } from "express";
import { SubmitContactBody, SubmitContactResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/contact", async (req, res, next) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid contact message",
        issues: parsed.error.issues,
      });
      return;
    }
    const [row] = await db
      .insert(contactMessagesTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(SubmitContactResponse.parse(row));
  } catch (error) {
    next(error);
  }
});

export default router;
