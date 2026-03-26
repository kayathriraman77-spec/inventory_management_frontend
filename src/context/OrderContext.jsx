import { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const OrderContext = createContext();

/* ==============================
      CUSTOM HOOK
============================== */
export const useOrder = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }

  return context;
};

/* ==============================
      PROVIDER
============================== */
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ==============================
        CREATE ORDER
  ============================== */
  const createOrder = async (cartItems, totalAmount) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/orders", {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
      });

      setOrders((prev) => [...prev, response.data]);

      alert("Order placed successfully ✅");
      return response.data;

    } catch (error) {
      console.error("Order Error:", error.response?.data);
      alert(error.response?.data?.message || "Order failed ❌");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
        GET ALL ORDERS (UPDATED ✅)
  ============================== */
  const getOrders = useCallback(async () => {
    try {
      setLoading(true);

      // 🔥 FIX HERE
      const response = await axiosInstance.get("/orders/all");

      setOrders(response.data || []);

    } catch (error) {
      console.error("Fetch Orders Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==============================
        CALCULATED VALUES
  ============================== */
  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  /* ==============================
        CONTEXT VALUE
  ============================== */
  const value = {
    orders,
    loading,
    createOrder,
    getOrders,
    totalOrders,
    totalSpent,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};