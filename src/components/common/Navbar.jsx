import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import "../../assets/styles/global.css";

export default function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const { notifications } = useNotifications();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowNotifications(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">

      <div className="navbar-right" ref={dropdownRef}>

        {/* 👤 Administrator + Avatar */}

        <div className="admin-profile" onClick={toggleDropdown}>

          <span className="admin-name">
            {user?.name || "Administrator"}
          </span>

          {/* 🔔 Notification Bell */}

          <div className="notification-wrapper" onClick={toggleNotifications}>

            <span className="bell-icon">🔔</span>

            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length}
              </span>
            )}

            {showNotifications && (

              <div className="notification-dropdown">

                <h4>Notifications</h4>

                {notifications.length === 0 ? (

                  <p>No notifications</p>

                ) : (

                  notifications.map((note) => (
                    <div key={note.id} className="notification-item">
                      {note.message}
                    </div>
                  ))

                )}
              </div>
            )}
          </div>

          <div className="admin-avatar">
            {firstLetter || "A"}
          </div>

        </div>

      </div>
    </div>
  );
}