import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function UserLayout() {

  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const { totalItems } = useCart();

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-1"
      : "text-gray-200 hover:text-indigo-400 transition duration-300 hover:scale-105";

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-50 min-h-screen"}>

      {/* NAVBAR */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-indigo-600 text-white"
        } shadow-md h-16 px-6 flex items-center justify-between sticky top-0 z-50`}
      >

        {/* BRAND */}
        <h2 className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/user/dashboard")}>
          Inventory
        </h2>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-6">

          <NavLink to="/user/dashboard" className={linkClass("/user/dashboard")}>
            Dashboard
          </NavLink>

          <NavLink to="/user/products" className={linkClass("/user/products")}>
            View Products
          </NavLink>

          <NavLink
            to="/user/purchase-request"
            className={linkClass("/user/purchase-request")}
          >
            Purchase Request
          </NavLink>

          {/* CART */}
          <div
            className="relative cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/user/cart")}
            aria-label="Cart"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>

          {/* USER GREETING */}
          <span className="font-medium">
            Hi, {user?.name || "User"}
          </span>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-2 py-1 rounded bg-gray-200 text-black hover:bg-gray-300 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className={darkMode ? "p-10 bg-gray-900 min-h-screen" : "p-10 bg-gray-50 min-h-screen"}>
        <Outlet />
      </div>
    </div>
  );
}