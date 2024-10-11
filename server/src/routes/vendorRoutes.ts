import { Router } from "express";
import { toggleVendorStatus } from "../controllers/vendorController";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

// Route to toggle vendor status
router.patch(
  "/:vendorId/toggle-status",
  authorizeRoles(["ADMIN"]), // Ensure only admins can access this route
  toggleVendorStatus
);

export default router;
