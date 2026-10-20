import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { PORT, NODE_ENV } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import advisoryRoutes from "./routes/advisoryRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB Atlas before accepting requests
connectDB();

// --- Core middleware ---
app.use(cors()); // for the demo, allow all origins; restrict to your frontend URL in production
app.use(express.json());
app.use("/api/query", queryRoutes); 
app.use(express.urlencoded({ extended: true }));

// Serve uploaded crop images statically so the frontend can display them
// // via 
// <img src="http://localhost:5000/uploads/xyz.jpg" />
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Health check (useful for quick sanity checks / deployment platforms) ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: NODE_ENV });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/advisory", advisoryRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/admin", adminRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});