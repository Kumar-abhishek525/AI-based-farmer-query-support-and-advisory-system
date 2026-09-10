// backend/routes/queryRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  askQuery,
  detectImageDisease,
  getQueryHistory,
} from "../controllers/queryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Store uploaded crop images on disk under backend/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

router.post("/ask", protect, askQuery);
router.post("/image-detect", protect, upload.single("image"), detectImageDisease);
router.get("/history/:userId", protect, getQueryHistory);

export default router;