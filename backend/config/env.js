// backend/config/env.js
import dotenv from "dotenv";

dotenv.config();

// Centralizes all env vars in one place so the rest of the app never
// touches process.env directly — makes it obvious what's required
// and gives a clear error instead of a silent undefined at runtime
const required = ["MONGO_URI", "JWT_SECRET"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const NODE_ENV = process.env.NODE_ENV || "development";

// AI service keys
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000"; // Python microservice, if used

// Weather API
export const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "";