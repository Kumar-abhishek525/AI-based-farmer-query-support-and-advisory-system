// src/pages/ExpertPanel.jsx
import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import api from "../services/api";

const ExpertPanel = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({}); // { queryId: text }
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    const fetchEscalated = async () => {
      try {
        const res = await api.get("/admin/query?status=escalated");
        setQueries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEscalated();
  }, []);

  const handleReview = async (queryId) => {
    const reply = replyDrafts[queryId];
    if (!reply?.trim()) return;

    setSubmittingId(queryId);
    try {
      await api.put(`/admin/query/${queryId}/review`, { expertReply: reply });
      setQueries((prev) => prev.filter((q) => q._id !== queryId));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Escalated Queries ({queries.length})
        </h1>

        {queries.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No escalated queries right now. 🎉
          </p>
        ) : (
          queries.map((q) => (
            <div key={q._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
              <div>
                <p className="text-sm text-gray-500">Farmer asked:</p>
                <p className="font-medium text-gray-800">{q.queryText}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">AI's initial response:</p>
                <p className="text-gray-600 text-sm">{q.aiResponse}</p>
              </div>

              <textarea
                placeholder="Write your expert reply..."
                rows={3}
                value={replyDrafts[q._id] || ""}
                onChange={(e) =>
                  setReplyDrafts({ ...replyDrafts, [q._id]: e.target.value })
                }
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />

              <button
                onClick={() => handleReview(q._id)}
                disabled={submittingId === q._id || !replyDrafts[q._id]?.trim()}
                className="self-end flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-50"
              >
                {submittingId === q._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Submit Review
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpertPanel;