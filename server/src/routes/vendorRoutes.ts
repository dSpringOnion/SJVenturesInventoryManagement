// routes/vendorRoutes.ts

import { Router } from "express";
import { toggleVendorStatus } from "../controllers/vendorController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

// Route to toggle vendor status
router.patch(
    "/:vendorId/toggle-status",
    authenticateToken, // Ensure only authenticated users can access this route
    authorizeRoles(["ADMIN"]), // Only admins can toggle vendor status
    toggleVendorStatus
);

export default router;