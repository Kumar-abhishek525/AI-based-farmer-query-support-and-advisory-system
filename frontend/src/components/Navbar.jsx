// src/components/Navbar.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sprout, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // user: { name, role } or null
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Links change based on role
  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === "farmer") {
      return [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Ask a Query", path: "/query" },
        { name: "History", path: "/history" },
        { name: "Advisory", path: "/advisory" },
      ];
    }
    if (user.role === "expert") {
      return [
        { name: "Expert Panel", path: "/expert" },
        { name: "Escalated Queries", path: "/expert/queries" },
      ];
    }
    if (user.role === "admin") {
      return [
        { name: "Admin Dashboard", path: "/admin" },
        { name: "Manage Users", path: "/admin/users" },
        { name: "Analytics", path: "/admin/analytics" },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Sprout size={24} />
            KisanAI
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-green-200 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-green-800 hover:bg-green-900 px-3 py-1.5 rounded-md transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-700 px-3 py-1.5 rounded-md font-medium hover:bg-green-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="hover:text-green-200"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;