// backend/utils/responseHandler.js

// Standardizes success responses across all controllers so the frontend
// can rely on a consistent { success, message, data } shape instead of
// each endpoint returning slightly different JSON structures
export const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, statusCode = 500, message = "Something went wrong") => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// Wraps an async controller so you don't need try/catch in every single
// function — errors are automatically forwarded to errorMiddleware.js
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
