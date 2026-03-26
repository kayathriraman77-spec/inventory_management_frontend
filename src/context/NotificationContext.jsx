import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /* ===============================
        ADD NOTIFICATION
  =============================== */

  const addNotification = (message, type) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => {
      // ✅ DUPLICATE CHECK
      const alreadyExists = prev.some(
        (n) => n.message === message && n.type === type
      );

      if (alreadyExists) return prev;

      return [newNotification, ...prev];
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};