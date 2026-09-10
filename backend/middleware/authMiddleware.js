// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";

// Verifies the JWT from the Authorization header and attaches the
// logged-in user to req.user for all downstream controllers
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized. User no longer exists." });
    }

    // req.user is what every controller (queryController, adminController, etc.) reads
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Not authorized. Invalid token." });
  }
};