// backend/services/aiService.js
import axios from "axios";
import { OPENAI_API_KEY, GEMINI_API_KEY } from "../config/env.js";

// System prompt steers the LLM to behave like a farming advisor, not a
// general chatbot, and to stay within a scope you can defend in your viva
const SYSTEM_PROMPT = `You are an agricultural advisory assistant for Indian farmers.
Answer questions about crops, soil, fertilizers, pest/disease management, irrigation, and farming practices.
Keep answers practical, concise (under 150 words), and specific to Indian farming conditions where relevant.
If the question is unrelated to agriculture, politely redirect the farmer to ask a farming-related question.
If the question describes a serious/unusual problem you're not confident about (e.g. unexplained crop death,
unknown disease symptoms), say so honestly and note that it should be reviewed by a human expert.`;

// Very small keyword-based classifier — good enough for a final year project;
// mention in your report that a proper implementation would fine-tune a
// classifier or ask the LLM itself to output a category as structured JSON
const categorize = (text) => {
  const t = text.toLowerCase();
  if (/(disease|infect|spots|fungus|pest|insect|rot)/.test(t)) return "disease";
  if (/(fertilizer|urea|npk|manure|nutrient)/.test(t)) return "fertilizer";
  if (/(rain|weather|temperature|climate|monsoon)/.test(t)) return "weather";
  if (/(price|market|sell|mandi|rate)/.test(t)) return "market";
  if (/(crop|sow|plant|harvest|seed|yield)/.test(t)) return "crop";
  return "general";
};

// Simple heuristic: if the LLM itself expresses uncertainty, flag for
// human/expert review instead of showing a possibly-wrong answer as final
const needsReview = (answer) => {
  const flags = ["not confident", "consult an expert", "unable to determine", "unsure"];
  return flags.some((f) => answer.toLowerCase().includes(f));
};

const callOpenAI = async (queryText) => {
  console.log("GEMINI_API_KEY value:", JSON.stringify(GEMINI_API_KEY));
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gemini-flash-lite-latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: queryText },
      ],
      max_tokens: 300,
      temperature: 0.4,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices[0].message.content.trim();
};

const callGemini = async (queryText) => {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nFarmer's question: ${queryText}` }] }],
    }
  );
  return res.data.candidates[0].content.parts[0].text.trim();
};

// @param queryText - the farmer's question
// @returns { answer, category, needsExpertReview }
export const getAIResponse = async (queryText) => {
  console.log("AI START:", queryText);
// ...existing Gemini call...
console.log("AI DONE");
  try {
    // Prefer OpenAI if configured, fall back to Gemini — lets you swap
    // providers via .env without touching controller code
    const answer = OPENAI_API_KEY
      ? await callOpenAI(queryText)
      : await callGemini(queryText);

    return {
      answer,
      category: categorize(queryText),
      needsExpertReview: needsReview(answer),
    };
  } catch (error) {
    console.error("AI service error:", error.response?.data || error.message);
    // Never let a broken AI call crash the query flow — degrade gracefully
    return {
      answer:
        "We couldn't process your question right now. It has been noted and an expert will review it soon.",
      category: categorize(queryText),
      needsExpertReview: true,
    };
  }
};