import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* LEFT SIDE - BRAND */}
      <Link to="/books" className="text-2xl font-bold text-blue-700">
        Readings Pattern
      </Link>

      {/* RIGHT SIDE - LINKS */}
      <div className="flex items-center space-x-6 text-gray-700 font-medium">
        <Link to="/books" className="hover:text-blue-600 transition">
          Home
        </Link>

        <Link to="/contact" className="hover:text-blue-600 transition">
          Contact Me
        </Link>

        {!isAuthenticated ? (
          <Link
            to="/login"
            className="hover:text-blue-600 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="hover:text-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
