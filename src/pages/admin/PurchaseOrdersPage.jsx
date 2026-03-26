import { useEffect, useState } from "react";
import axios from "axios";

const PurchaseOrdersPage = () => {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {

    const res = await axios.get("http://localhost:5000/api/purchase-orders");

    if (res.data.success) {
      setOrders(res.data.orders);
    }

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ADD QUANTITY (same old API) */

  const addQuantity = async (orderId) => {

    try {

      const res = await axios.put(
        `http://localhost:5000/api/purchase-orders/deliver/${orderId}`
      );

      if (res.data.success) {

        alert("Stock Updated Successfully");

        fetchOrders();

      }

    } catch (error) {

      console.error(error);
      alert("Error updating stock");

    }

  };

  return (

    <div className="page-container">

      <h2 className="page-title">Purchase Orders</h2>

      <table className="product-table">

        <thead>
          <tr>
            <th>Product</th>
            <th>Supplier</th>
            <th>Email</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {orders.length === 0 ? (

            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Purchase Orders
              </td>
            </tr>

          ) : (

            orders.map((order) => (

              <tr key={order._id}>

                <td>{order.productName}</td>
                <td>{order.supplierName}</td>
                <td>{order.supplierEmail}</td>
                <td>{order.quantity}</td>

                {/* STATUS ALWAYS DELIVERED */}

                <td>
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Delivered
                  </span>
                </td>

                {/* ADD QUANTITY BUTTON */}

                <td>

                  <button
                    className="add-qty-btn"
                    onClick={() => addQuantity(order._id)}
                  >
                    Add Quantity
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );
};

export default PurchaseOrdersPage;