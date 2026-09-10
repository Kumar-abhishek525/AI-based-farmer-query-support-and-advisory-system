// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// allowedRoles is optional — omit it to just require "logged in, any role"
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or a spinner, avoids a flash-redirect on refresh

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;