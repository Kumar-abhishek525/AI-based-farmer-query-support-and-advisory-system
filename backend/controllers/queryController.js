// backend/controllers/queryController.js
import Query from "../models/Query.js";
import DiseaseDetection from "../models/DiseaseDetection.js";
import { getAIResponse } from "../services/aiService.js";
import { predictDisease } from "../services/mlService.js";
// @route POST /api/query/ask
// export const askQuery = async (req, res) => {
//   try {
//     const { queryText, queryType } = req.body;
//     const farmerId = req.user.id;

//     if (!queryText?.trim()) {
//       return res.status(400).json({ message: "Query text is required." });
//     }
//      const lang = language === "hi" ? "hi" : "en";
//     // aiService.js handles the actual LLM call + category classification
//     const { answer, category, needsExpertReview } = await getAIResponse(queryText);

//     const query = await Query.create({
//       farmerId,
//       queryText,
//       queryType: queryType || "text",
//       aiResponse: answer,
//       category,
//       status: needsExpertReview ? "escalated" : "answered",
//     });

//     res.status(201).json(query);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to process your query.", error: error.message });
//   }
// };

export const askQuery = async (req, res) => {
  try {
    const { queryText, queryType, language } = req.body;
    const farmerId = req.user.id;

    if (!queryText?.trim()) {
      return res.status(400).json({ message: "Query text is required." });
    }

    const lang = language === "hi" ? "hi" : "en";

    // 1. AI call
    const { answer, category, needsExpertReview } = await getAIResponse(queryText, lang);
    console.log("AI RESULT:", { answer: answer?.slice(0, 80), category, needsExpertReview });

    // 2. Save to MongoDB
    const query = await Query.create({
      farmerId,
      queryText,
      queryType: queryType || "text",
      aiResponse: answer,
      category,
      status: needsExpertReview ? "escalated" : "answered",
    });
    console.log("SAVED:", query._id);

    // 3. Send response
    res.status(201).json(query);
    console.log("RESPONSE SENT");
  } catch (error) {
    console.error("ASK ROUTE ERROR:", error);
    res.status(500).json({ message: "Failed to process your query.", error: error.message });
  }
};

// @route POST /api/query/image-detect
export const detectImageDisease = async (req, res) => {
  try {
    const farmerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "An image file is required." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // mlService.js forwards the image to the Python microservice
    const { disease, confidence, cropType, treatment, severity } =
      await detectDisease(req.file.path);

    const query = await Query.create({
      farmerId,
      queryText: `Disease detection for uploaded crop image`,
      queryType: "image",
      imageUrl,
      aiResponse: `Detected: ${disease}. ${treatment}`,
      category: "disease",
      status: confidence < 0.6 ? "escalated" : "answered", // low-confidence results go to an expert
    });

    const detection = await DiseaseDetection.create({
      farmerId,
      queryId: query._id,
      imageUrl,
      predictedDisease: disease,
      confidence,
      cropType,
      treatmentSuggestion: treatment,
      severity,
    });

    res.status(201).json({ query, detection });
  } catch (error) {
    res.status(500).json({ message: "Disease detection failed.", error: error.message });
  }
};

// @route GET /api/query/history/:userId
export const getQueryHistory = async (req, res) => {
  try {
    // Farmers can only view their own history; admins/experts could be allowed
    // to pass any userId — enforce that check here if you extend this route
    if (req.user.id !== req.params.userId && req.user.role === "farmer") {
      return res.status(403).json({ message: "Not authorized to view this history." });
    }

    const history = await Query.find({ farmerId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history.", error: error.message });
  }
};

export const detectDiseaseFromImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const result = await predictDisease(req.file, req.body.lang || "hi");
    res.status(200).json(result);
  } catch (err) {
    console.error("Image detect error:", err.message);
    res.status(500).json({ error: err.message || "Disease detection failed" });
  }
};