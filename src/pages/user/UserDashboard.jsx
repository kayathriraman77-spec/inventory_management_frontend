import { useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { useOrder } from "../../context/OrderContext";

export default function UserDashboard() {
  const { products } = useProducts();
  const { orders, getOrders } = useOrder();

  useEffect(() => {
    getOrders();
  }, []);

  const totalOrders = orders?.length || 0;

  const totalSpent =
    orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

  const recentOrders = orders?.slice(0, 3) || [];

  /* ✅ UPDATED STATUS CLASS (Step 5) */

  const getStatusClass = () => {
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        User Dashboard
      </h2>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* PRODUCTS */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300">

          <div className="absolute top-5 right-5 text-3xl bg-white/20 p-2 rounded-full">
            📦
          </div>

          <p className="text-sm opacity-80">Total Products</p>

          <h2 className="text-3xl font-bold mt-2">
            {products?.length || 0}
          </h2>

        </div>

        {/* ORDERS */}
        <div className="relative bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-2xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300">

          <div className="absolute top-5 right-5 text-3xl bg-white/20 p-2 rounded-full">
            🛒
          </div>

          <p className="text-sm opacity-80">Total Orders</p>

          <h2 className="text-3xl font-bold mt-2">
            {totalOrders}
          </h2>

        </div>

        {/* SPENT */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300">

          <div className="absolute top-5 right-5 text-3xl bg-white/20 p-2 rounded-full">
            💰
          </div>

          <p className="text-sm opacity-80">Total Spent</p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{totalSpent}
          </h2>

        </div>

      </div>

      {/* RECENT ORDERS */}

      <div className="mt-12">

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Orders
        </h3>

        {recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100 text-gray-700">

                <tr>
                  <th className="p-4 text-left">Order Date</th>
                  <th className="p-4 text-left">Total Amount</th>
                  <th className="p-4 text-left">Status</th>
                </tr>

              </thead>

              <tbody>

                {recentOrders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4 font-medium">
                      ₹{order.totalAmount || 0}
                    </td>

                    <td className="p-4">

                      {/* ✅ UPDATED STATUS DISPLAY */}

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${getStatusClass()}`}
                      >
                        Ordered
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}