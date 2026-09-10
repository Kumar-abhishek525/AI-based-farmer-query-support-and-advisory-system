// backend/models/DiseaseDetection.js
import mongoose from "mongoose";

const diseaseDetectionSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
    },
    imageUrl: { type: String, required: true },
    predictedDisease: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1 }, // e.g. 0.92 from the ML model
    cropType: { type: String },
    treatmentSuggestion: { type: String },
    severity: {
      type: String,
      enum: ["low", "moderate", "high"],
    },
  },
  { timestamps: true }
);

diseaseDetectionSchema.index({ farmerId: 1, createdAt: -1 });

export default mongoose.model("DiseaseDetection", diseaseDetectionSchema);