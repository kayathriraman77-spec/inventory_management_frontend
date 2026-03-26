import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaChartBar,
  FaBars,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/global.css";
import { FaShoppingCart } from "react-icons/fa";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        <FaBars />
      </div>

      <aside
        className={`pro-sidebar 
        ${collapsed ? "collapsed" : ""} 
        ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-header">
          <h2>{collapsed ? "IMS" : "Inventory"}</h2>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

        <nav>
          {role === "admin" && (
            <>
              <NavLink to="/admin/dashboard" className="nav-item">
                <FaTachometerAlt />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>

              <NavLink to="/admin/products" className="nav-item">
                <FaBoxOpen />
                {!collapsed && <span>Products</span>}
              </NavLink>

              <NavLink to="/admin/users" className="nav-item">
                <FaUsers />
                {!collapsed && <span>Users</span>}
              </NavLink>

              <NavLink to="/admin/reports" className="nav-item">
                <FaChartBar />
                {!collapsed && <span>Reports</span>}
              </NavLink>

              {/* ❌ Removed Admin Orders */}

              <NavLink to="/admin/purchase-orders" className="nav-item">
                <FaShoppingCart />
                {!collapsed && <span>Purchase Orders</span>}
              </NavLink>
            </>
          )}

          {role === "user" && (
            <>
              <NavLink to="/user/dashboard" className="nav-item">
                <FaTachometerAlt />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>

              <NavLink to="/user/products" className="nav-item">
                <FaBoxOpen />
                {!collapsed && <span>Products</span>}
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}