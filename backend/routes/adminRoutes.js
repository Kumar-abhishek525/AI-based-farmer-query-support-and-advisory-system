// backend/routes/adminRoutes.js
import express from "express";
import {
  getAnalytics,
  getQueriesByStatus,
  reviewQuery,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Analytics + user management: admin-only
router.get("/analytics", protect, authorize("admin"), getAnalytics);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

// Query review: both experts and admins can review escalated queries
router.get("/query", protect, authorize("admin", "expert"), getQueriesByStatus);
router.put("/query/:id/review", protect, authorize("admin", "expert"), reviewQuery);

export default router;