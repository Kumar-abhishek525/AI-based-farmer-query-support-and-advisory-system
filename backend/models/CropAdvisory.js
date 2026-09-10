// backend/models/CropAdvisory.js
import mongoose from "mongoose";

const cropAdvisorySchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true, trim: true },
    season: {
      type: String,
      enum: ["kharif", "rabi", "zaid", "year-round"],
      required: true,
    },
    soilType: { type: String, trim: true }, // e.g. "loamy", "clay", "sandy"
    region: { type: String, trim: true }, // state/district this advisory applies to
    recommendedPractices: [{ type: String }],
    commonDiseases: [{ type: String }],
    fertilizerGuidance: { type: String },
    idealTemperature: {
      min: Number,
      max: Number,
    },
    waterRequirement: { type: String }, // e.g. "low", "medium", "high"
  },
  { timestamps: true }
);

cropAdvisorySchema.index({ cropName: 1, region: 1 });

export default mongoose.model("CropAdvisory", cropAdvisorySchema);