// backend/services/mlService.js
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { ML_SERVICE_URL } from "../config/env.js";

// Forwards the uploaded image to your Python microservice (FastAPI/Flask)
// running the trained crop-disease CNN model at ai-service/app.py
// @param imagePath - local file path from multer (req.file.path)
// @returns { disease, confidence, cropType, treatment, severity }
export const detectDisease = async (imagePath) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    const res = await axios.post(`${ML_SERVICE_URL}/predict`, form, {
      headers: form.getHeaders(),
      timeout: 15000,
    });

    // Shape this to match whatever your Python service actually returns —
    // adjust field names here once ai-service/app.py is built
    const { disease, confidence, crop_type, treatment, severity } = res.data;

    return {
      disease: disease || "Unknown",
      confidence: confidence ?? 0,
      cropType: crop_type || "Unknown",
      treatment: treatment || "No treatment suggestion available. Please consult an expert.",
      severity: severity || "moderate",
    };
  } catch (error) {
    console.error("ML service error:", error.response?.data || error.message);
    // Graceful fallback so a down/unbuilt ML service doesn't crash the request —
    // this also lets you demo the full flow before the Python model is finished
    return {
      disease: "Unable to determine",
      confidence: 0,
      cropType: "Unknown",
      treatment: "Detection service is currently unavailable. This has been sent to an expert.",
      severity: "moderate",
    };
  }
};