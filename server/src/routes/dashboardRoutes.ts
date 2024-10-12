import { Router } from "express";
import { getLowStockProducts } from "../controllers/dashboardController";

const router = Router();

// Route to get low stock products
router.get("/low-stock", getLowStockProducts);

export default router;