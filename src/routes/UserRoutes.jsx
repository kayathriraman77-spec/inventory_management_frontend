import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import OrderSuccessPage from "../pages/user/OrderSuccessPage";
import UserLayout from "../layouts/UserLayout";
import UserDashboard from "../pages/user/UserDashboard";
import ViewProductsPage from "../pages/user/ViewProductsPage";
import PurchaseRequestPage from "../pages/user/PurchaseRequestPage";
import CartPage from "../pages/user/CartPage";

export default function UserRoutes() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;
  if (user.role?.toLowerCase() !== "user")
    return <Navigate to="/unauthorized" />;

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="products" element={<ViewProductsPage />} />
        <Route path="purchase-request" element={<PurchaseRequestPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
      </Route>
    </Routes>
  );
}