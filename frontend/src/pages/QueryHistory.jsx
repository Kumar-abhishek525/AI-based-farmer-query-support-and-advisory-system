// src/pages/QueryHistory.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdvisoryCard from "../components/AdvisoryCard";
import api from "../services/api";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["all", "crop", "disease", "fertilizer", "weather", "market"];

const QueryHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/query/history/${user.id}`);
        setHistory(res.data);
      } catch (err) {
        setError("Couldn't load your query history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const filtered =
    filter === "all" ? history : history.filter((q) => q.category === filter);

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Query History</h1>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize ${
                filter === cat
                  ? "bg-green-700 text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No queries found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((advisory) => (
              <AdvisoryCard key={advisory._id} advisory={advisory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryHistory;