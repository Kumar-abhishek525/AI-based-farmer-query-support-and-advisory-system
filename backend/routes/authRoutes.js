// backend/routes/authRoutes.js
import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); // used to re-validate a session on app load

export default router;