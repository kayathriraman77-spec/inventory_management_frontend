import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import "../assets/styles/global.css";

export default function AdminLayout() {

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { notifications } = useNotifications();

  const name = localStorage.getItem("name");

  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="app-sidebar">

        <h2 className="app-logo">Inventory</h2>

        <nav className="app-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/reports">Reports</NavLink>
          <NavLink to="/admin/purchase-orders">Purchase Orders</NavLink>
        </nav>

        <button className="app-logout" onClick={handleLogout}>
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <div className="app-main">

        {/* TOPBAR */}
        <div className="app-topbar">

          {/* LEFT */}
          <div className="topbar-left">
            <h3>Welcome back, {name} 👋</h3>
            <p className="topbar-subtext">
              Here’s your inventory overview for today.
            </p>
          </div>

          {/* RIGHT */}
          <div className="topbar-right">

            {/* 🔔 NOTIFICATION BELL */}
            <div
              className="dashboard-bell"
              onClick={() => setNotifyOpen(!notifyOpen)}
            >
              🔔

              {notifications.length > 0 && (
                <span className="dashboard-bell-count">
                  {notifications.length}
                </span>
              )}

              {/* DROPDOWN */}
              {notifyOpen && (
                <div className="notification-dropdown">

                  {notifications.length === 0 ? (
                    <p>No notifications</p>
                  ) : (
                    notifications.map((note) => (
                      <div key={note.id} className="notification-item">

                        <strong>{note.type}</strong> : {note.message}

                        <br />

                        <small>{note.time}</small>

                      </div>
                    ))
                  )}

                </div>
              )}
            </div>

            {/* PROFILE */}
            <div
              className="profile-section"
              onClick={() => setOpen(!open)}
            >

              <div className="profile-avatar">
                👤
              </div>

              <div className="profile-info">
                <span className="profile-name">{name}</span>
                <span className="profile-role">Administrator</span>
              </div>

            </div>

            {/* PROFILE DROPDOWN */}
            {open && (
              <div className="profile-dropdown">
                <NavLink to="/admin/profile">My Profile</NavLink>
                <NavLink to="/admin/dashboard">Dashboard</NavLink>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="app-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}