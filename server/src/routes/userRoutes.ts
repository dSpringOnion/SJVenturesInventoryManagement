// routes/userRoutes.ts

import express from "express";
import { signup, login, getUsers } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", authenticateToken, getUsers);

export default router;
