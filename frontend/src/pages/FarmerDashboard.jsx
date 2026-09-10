// src/pages/FarmerDashboard.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import QueryBox from "../components/QueryBox";
import ImageUpload from "../components/ImageUpload";
import AdvisoryCard from "../components/AdvisoryCard";
import WeatherWidget from "../components/WeatherWidget";

const FarmerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [tab, setTab] = useState("text"); // "text" | "image"

  // newest response appears first
  const handleNewResponse = (advisory) => {
    setResults((prev) => [advisory, ...prev]);
  };

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500 text-sm">
            Ask a question or upload a crop photo to get advice.
          </p>
        </div>

        <WeatherWidget location={user?.location?.district} />

        {/* Tab switch between text/voice query and image detection */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("text")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === "text" ? "bg-green-700 text-white" : "bg-white text-gray-600"
            }`}
          >
            Ask a Question
          </button>
          <button
            onClick={() => setTab("image")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === "image" ? "bg-green-700 text-white" : "bg-white text-gray-600"
            }`}
          >
            Detect Disease
          </button>
        </div>

        {tab === "text" ? (
          <QueryBox onNewResponse={handleNewResponse} />
        ) : (
          <ImageUpload onDetectionResult={handleNewResponse} />
        )}

        <div className="flex flex-col gap-4">
          {results.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              Your advisory results will appear here.
            </p>
          ) : (
            results.map((advisory, i) => (
              <AdvisoryCard key={advisory._id || i} advisory={advisory} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;