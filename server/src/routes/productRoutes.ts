// routes/productRoutes.ts

import express from "express";
import {
  createProduct,
  getProducts,
  getLowStockProducts,
} from "../controllers/productController";

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/low-stock", getLowStockProducts);

export default router;
