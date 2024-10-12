// routes/userRoutes.ts

import express from "express";
import { signup, login, getUsers } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles"; // Add this for role-based access

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", authenticateToken, authorizeRoles(["ADMIN"]), getUsers); // Restrict this to admins if necessary

export default router;