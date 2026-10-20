// src/components/AdvisoryCard.jsx
import { useState } from "react";
import {
  Volume2,
  VolumeX,
  Sprout,
  Leaf,
  Bug,
  Cloud,
  Droplets,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
} from "lucide-react";
// categoryStyles maps a query category to an icon + color so the card
// visually signals what kind of advice it is at a glance
const categoryStyles = {
  disease: { icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  crop: { icon: Sprout, color: "text-green-600 bg-green-50" },
  fertilizer: { icon: Leaf, color: "text-emerald-600 bg-emerald-50" },
  weather: { icon: Droplets, color: "text-blue-600 bg-blue-50" },
  default: { icon: Leaf, color: "text-gray-600 bg-gray-50" },
};

const AdvisoryCard = ({ advisory }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!advisory) return null;

  const speak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(advisory.aiResponse);
    const isHindi = /[\u0900-\u097F]/.test(advisory.aiResponse);
    utterance.lang = isHindi ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const { icon: Icon, color } =
    categoryStyles[advisory.category] || categoryStyles.default;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-2 py-1 rounded-md ${color}`}>
          <Icon size={16} />
          <span className="text-xs font-medium capitalize">
            {advisory.category || "General"}
          </span>
        </div>
        {advisory.status === "escalated" && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">
            Sent to expert
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500">You asked:</p>
        <p className="font-medium text-gray-800">{advisory.queryText}</p>
      </div>

     <div>
  <div className="flex items-center justify-between">
    <p className="text-sm text-gray-500">Advisory:</p>
    <button
      onClick={speak}
      className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900"
    >
      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
      {isSpeaking ? "Stop" : "Listen"}
    </button>
  </div>
  <p className="text-gray-700 whitespace-pre-line">{advisory.aiResponse}</p>
</div>

      {advisory.createdAt && (
        <p className="text-xs text-gray-400 self-end">
          {new Date(advisory.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default AdvisoryCard;