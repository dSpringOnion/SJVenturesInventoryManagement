// routes/invoiceRoutes.ts

import express from "express";
import { createInvoice, getInvoices } from "../controllers/invoiceController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

// Route to create a new invoice (authenticated users only)
router.post("/", authenticateToken, authorizeRoles(["MANAGER", "ADMIN"]), createInvoice);

// Route to get all invoices (only admins can view all invoices)
router.get("/", authenticateToken, authorizeRoles(["ADMIN"]), getInvoices);

export default router;
