// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import QueryHistory from "./pages/QueryHistory";
import AdminDashboard from "./pages/AdminDashboard";
import ExpertPanel from "./pages/ExpertPanel";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer-only routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <QueryHistory />
              </ProtectedRoute>
            }
          />

          {/* Expert-only route */}
          <Route
            path="/expert"
            element={
              <ProtectedRoute allowedRoles={["expert"]}>
                <ExpertPanel />
              </ProtectedRoute>
            }
          />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

