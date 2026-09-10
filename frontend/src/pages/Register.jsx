// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer",
    state: "",
    district: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        location: { state: form.state, district: form.district },
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create Account
        </h2>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
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
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <div className="flex gap-2">
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="farmer">Farmer</option>
          <option value="expert">Expert / Agronomist</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white py-2 rounded-md font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;