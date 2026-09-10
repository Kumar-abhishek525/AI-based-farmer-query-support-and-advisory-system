// backend/models/Query.js
import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    queryText: { type: String, required: true, trim: true },
    queryType: {
      type: String,
      enum: ["text", "voice", "image"],
      default: "text",
    },
    imageUrl: { type: String }, // set when queryType is "image"
    aiResponse: { type: String },
    category: {
      type: String,
      enum: ["crop", "disease", "fertilizer", "weather", "market", "general"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["answered", "escalated", "expert-reviewed"],
      default: "answered",
    },
    expertReply: { type: String }, // filled in if an expert reviews it
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Speeds up "my query history" and "all escalated queries" lookups
querySchema.index({ farmerId: 1, createdAt: -1 });
querySchema.index({ status: 1 });

export default mongoose.model("Query", querySchema);