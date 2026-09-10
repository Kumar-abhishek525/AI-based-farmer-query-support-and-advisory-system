// backend/middleware/roleMiddleware.js

// Usage: router.get("/admin/analytics", protect, authorize("admin"), getAnalytics)
// Must run AFTER protect, since it relies on req.user being set
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires one of these roles: ${allowedRoles.join(", ")}.`,
      });
    }

    next();
  };
};