import { Router } from "express";
import { getExpenseSummary } from "../controllers/expenseController";

const router = Router();

router.get("/", getExpenseSummary);

export default router;
