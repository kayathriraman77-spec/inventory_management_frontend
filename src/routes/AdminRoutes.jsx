import { Routes, Route, Navigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProductProvider } from "../context/ProductContext";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductsPage from "../pages/admin/ProductsPage";
import PurchaseOrdersPage from "../pages/admin/PurchaseOrdersPage";

import UsersPage from "../pages/admin/UsersPage";
import ReportsPage from "../pages/admin/ReportsPage";
import AdminProfilePage from "../pages/admin/AdminProfilePage";


function AdminRoutes() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;
  if (user.role?.toLowerCase() !== "admin")
    return <Navigate to="/unauthorized" />;

  return (
    <ProductProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
           
        </Route>
      </Routes>
    </ProductProvider>
  );
}

export default AdminRoutes;