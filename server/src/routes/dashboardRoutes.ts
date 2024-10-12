// routes/dashboardRoutes.ts

import { Router } from "express";
import { getLowStockProducts } from "../controllers/dashboardController";
import { authenticateToken } from "../middleware/authMiddleware"; // Add authentication if needed
import { authorizeRoles } from "../middleware/authorizeRoles"; // Add role-based access control if needed

const router = Router();

// Route to get low stock products
router.get("/low-stock", authenticateToken, authorizeRoles(["ADMIN", "MANAGER"]), getLowStockProducts); // Restrict to admins or managers

export default router;