// backend/middleware/errorMiddleware.js
import { NODE_ENV } from "../config/env.js";

// Catches requests to routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error handler — every controller's catch block, or any error
// passed via next(error), ends up here instead of crashing the server
// or leaking a raw stack trace to the client
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server error.";

  // Mongoose bad ObjectId (e.g. malformed :id param)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format.";
  }

  // Mongoose duplicate key (e.g. registering with an email already in use)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already in use.`;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  res.status(statusCode).json({
    message,
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};