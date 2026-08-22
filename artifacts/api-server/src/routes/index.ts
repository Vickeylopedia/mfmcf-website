import { Router, type IRouter } from "express";
import adminRouter from "./admin";
import contactRouter from "./contact";
import contentRouter from "./content";
import healthRouter from "./health";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(newsletterRouter);
router.use(contentRouter);
router.use(adminRouter);

export default router;
