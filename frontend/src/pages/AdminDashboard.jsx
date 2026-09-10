// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Users, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react";
import api from "../services/api";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
    <div className={`p-3 rounded-md ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Farmers"
            value={stats?.totalFarmers ?? 0}
            color="bg-green-100 text-green-700"
          />
          <StatCard
            icon={MessageSquare}
            label="Total Queries"
            value={stats?.totalQueries ?? 0}
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={AlertTriangle}
            label="Escalated Queries"
            value={stats?.escalatedQueries ?? 0}
            color="bg-yellow-100 text-yellow-700"
          />
          <StatCard
            icon={TrendingUp}
            label="Most Common Issue"
            value={stats?.topCategory ?? "N/A"}
            color="bg-purple-100 text-purple-700"
          />
        </div>

        {/* Region-wise / category-wise breakdown table */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Queries by Category</h2>
          <div className="flex flex-col gap-2">
            {(stats?.categoryBreakdown || []).map((c) => (
              <div key={c.category} className="flex justify-between text-sm">
                <span className="capitalize text-gray-600">{c.category}</span>
                <span className="font-medium text-gray-800">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;