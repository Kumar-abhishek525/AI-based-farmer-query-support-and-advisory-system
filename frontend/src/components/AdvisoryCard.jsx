// src/components/AdvisoryCard.jsx
import { Leaf, AlertTriangle, Sprout, Droplets } from "lucide-react";

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
  // advisory: { queryText, aiResponse, category, createdAt, status }
  if (!advisory) return null;

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
        <p className="text-sm text-gray-500">Advisory:</p>
        <p className="text-gray-700 whitespace-pre-line">
          {advisory.aiResponse}
        </p>
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