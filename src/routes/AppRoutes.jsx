import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";

function AppRoutes() {

  const location = useLocation(); // 🔥 NEW

  useEffect(() => {

    if (location.pathname.startsWith("/admin")) {
      document.title = "Admin Dashboard";
    } 
    else if (location.pathname.startsWith("/user")) {
      document.title = "User Dashboard";
    } 
    else {
      document.title = "Inventory System";
    }

  }, [location]); // 🔥 RUNS ON ROUTE CHANGE

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;