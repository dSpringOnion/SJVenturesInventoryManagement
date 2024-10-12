// routes/productRoutes.ts

import express from "express";
import {
  createProduct,
  getProducts,
  getLowStockProducts,
} from "../controllers/productController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

// Only admins and managers can create products
router.post(
    "/products",
    authenticateToken,  // Ensure only authenticated users can access this route
    authorizeRoles(["ADMIN", "MANAGER"]), // Restrict to ADMIN and MANAGER roles
    createProduct
);

// All authenticated users can view products
router.get(
    "/products",
    authenticateToken,  // Ensure only authenticated users can access this route
    getProducts
);

// Only admins and managers can view low stock products
router.get(
    "/products/low-stock",
    authenticateToken,  // Ensure only authenticated users can access this route
    authorizeRoles(["ADMIN", "MANAGER"]), // Restrict to ADMIN and MANAGER roles
    getLowStockProducts
);

export default router;