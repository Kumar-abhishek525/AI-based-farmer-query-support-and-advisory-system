// backend/routes/advisoryRoutes.js
import express from "express";
import {
  getAdvisoryByCrop,
  listAdvisories,
  createAdvisory,
  updateAdvisory,
} from "../controllers/advisoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public-ish: any logged-in user (farmer, expert, admin) can read advisories
router.get("/", protect, listAdvisories);
router.get("/:cropName", protect, getAdvisoryByCrop);

// Only admins manage the knowledge base
router.post("/", protect, authorize("admin"), createAdvisory);
router.put("/:id", protect, authorize("admin"), updateAdvisory);

export default router;