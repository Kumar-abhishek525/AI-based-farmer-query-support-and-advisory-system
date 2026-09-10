// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Never allow public registration to create admins
    const safeRole = role === "expert" ? "expert" : "farmer";

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: safeRole,
      location,
    });

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

// @route GET /api/auth/me  (used to re-validate a session, e.g. on refresh)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user.", error: error.message });
  }
};