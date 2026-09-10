// backend/routes/weatherRoutes.js
import express from "express";
import { getWeather } from "../controllers/weatherController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:location", protect, getWeather);

export default router;