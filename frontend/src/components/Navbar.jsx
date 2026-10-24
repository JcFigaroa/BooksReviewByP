import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `transition hover:text-pine-600 ${isActive ? "text-pine-700" : ""}`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 border-b border-frost-200 bg-frost-50/80 px-4 backdrop-blur sm:px-6">
      {/* LEFT SIDE - BRAND */}
      <Link to="/books" className="whitespace-nowrap font-script text-3xl leading-none text-berry-600 sm:text-4xl">
        Readings Pattern
      </Link>

      {/* RIGHT SIDE - LINKS */}
      <div className="flex items-center gap-4 whitespace-nowrap text-sm font-semibold text-ink-700 sm:gap-6 sm:text-base">
        <NavLink to="/books" className={linkClass}>
          Home
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        )}

        {!isAuthenticated ? (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        ) : (
          <button onClick={logout} className="transition hover:text-berry-600">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
