// routes/expenseRoutes.ts

import { Router } from "express";
import { getExpenseSummary } from "../controllers/expenseController";
import { authenticateToken } from "../middleware/authMiddleware"; // Add this for authentication
import { authorizeRoles } from "../middleware/authorizeRoles"; // Add this for role-based access if necessary

const router = Router();

router.get("/", authenticateToken, authorizeRoles(["ADMIN", "MANAGER"]), getExpenseSummary); // Restrict to certain roles if necessary

export default router;