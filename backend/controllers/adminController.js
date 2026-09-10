// backend/controllers/adminController.js
import User from "../models/User.js";
import Query from "../models/Query.js";

// @route GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: "farmer" });
    const totalQueries = await Query.countDocuments();
    const escalatedQueries = await Query.countDocuments({ status: "escalated" });

    const categoryBreakdown = await Query.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    const topCategory = categoryBreakdown[0]?.category || "N/A";

    res.status(200).json({
      totalFarmers,
      totalQueries,
      escalatedQueries,
      topCategory,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics.", error: error.message });
  }
};

// @route GET /api/admin/query?status=escalated
export const getQueriesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const queries = await Query.find(filter)
      .populate("farmerId", "name location")
      .sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch queries.", error: error.message });
  }
};

// @route PUT /api/admin/query/:id/review  (used by ExpertPanel.jsx too)
export const reviewQuery = async (req, res) => {
  try {
    const { expertReply } = req.body;

    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        expertReply,
        status: "expert-reviewed",
        reviewedBy: req.user.id,
      },
      { new: true }
    );

    if (!query) return res.status(404).json({ message: "Query not found." });
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review.", error: error.message });
  }
};

// @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
};

// @route DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user.", error: error.message });
  }
};