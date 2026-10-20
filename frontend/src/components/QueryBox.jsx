// src/components/QueryBox.jsx
import { useState, useRef } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import api from "../services/api";

const QueryBox = ({ onNewResponse }) => {
  const [queryText, setQueryText] = useState("");
  const [language, setLanguage] = useState("en"); // "en" | "hi"
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  // Detects Hindi by checking for Devanagari script characters
const detectLanguage = (text) => {
  const isHindi = /[\u0900-\u097F]/.test(text);
  return isHindi ? "hi" : "en";
};

  // Voice input using the browser's Web Speech API (no extra library needed)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input isn't supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
   recognition.lang = language === "hi" ? "hi-IN" : "en-IN";   // change to "hi-IN" for Hindi
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setError("Couldn't hear that. Please try again.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQueryText((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!queryText.trim()) return;

  setLoading(true);
  setError("");

  const detectedLang = detectLanguage(queryText); // auto-detect from actual text

  try {
    const res = await api.post("/query/ask", {
      queryText,
      queryType: "text",
      language: detectedLang, // matches whatever script the farmer actually used
    });
    onNewResponse?.(res.data);
    setQueryText("");
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
    >
      <label className="font-medium text-gray-700">
        Ask your farming question
      </label>

      <div className="flex gap-2">
        <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="e.g. My wheat leaves are turning yellow, what should I do?"
          rows={3}
          className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
        />

        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`h-fit p-2 rounded-md ${
            isListening
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
          title={isListening ? "Stop recording" : "Speak your question"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !queryText.trim()}
        className="self-end flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Getting advice...
          </>
        ) : (
          <>
            <Send size={16} /> Ask
          </>
        )}
      </button>
    </form>
  );
};

export default QueryBox;