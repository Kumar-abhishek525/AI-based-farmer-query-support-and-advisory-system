// backend/models/WeatherLog.js
import mongoose from "mongoose";

// Caches weather API responses per location so you're not hitting the
// external weather API on every single dashboard load — also gives you
// a "weather history" you can show/analyze later
const weatherLogSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    temperature: { type: Number },
    condition: { type: String }, // "clear", "rain", "cloudy", etc.
    humidity: { type: Number },
    rainChance: { type: Number },
    windSpeed: { type: Number },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Look up the most recent cached entry for a location quickly
weatherLogSchema.index({ location: 1, fetchedAt: -1 });

export default mongoose.model("WeatherLog", weatherLogSchema);