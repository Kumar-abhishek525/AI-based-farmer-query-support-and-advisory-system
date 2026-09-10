// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);

      // redirect based on role
      const role = res.data.user.role;
      navigate(role === "admin" ? "/admin" : role === "expert" ? "/expert" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white py-2 rounded-md font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-700 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;