import express from "express";
import { signup, login, getUsers } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";  // Middleware to verify JWT tokens

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Protected route to get all users (Admin only)
router.get("/", authenticateToken, getUsers);

export default router;