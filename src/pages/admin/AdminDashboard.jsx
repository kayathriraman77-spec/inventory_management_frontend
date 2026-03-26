import { useEffect, useState } from "react";
import "../../assets/styles/global.css";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../context/ProductContext";
import { useOrder } from "../../context/OrderContext";
import { useNotifications } from "../../context/NotificationContext";

export default function AdminDashboard() {

  const { user } = useAuth();
  const { products, lowStockProducts } = useProducts();
  const { orders, getOrders } = useOrder();
  const { notifications } = useNotifications();

  /* ===============================
        EDITABLE REFILL STATE
  =============================== */

  const [editedRefills, setEditedRefills] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);

  /* ===============================
        FETCH ORDERS WHEN LOAD
  =============================== */

  useEffect(() => {
    getOrders();
  }, []);

  /* ===============================
        HANDLE EDIT CHANGE
  =============================== */

  const handleRefillChange = (productId, value) => {
    setEditedRefills((prev) => ({
      ...prev,
      [productId]: value
    }));
  };

  /* ===============================
        CREATE PURCHASE ORDER
  =============================== */

  const contactSupplier = async (product) => {

    try {

      // 🔥 UPDATED SMART REORDER LOGIC
      const deficit = product.reorderLevel - product.quantity;
      const buffer = 20;
      const defaultRefill =
        deficit > 0 ? deficit + buffer : product.reorderLevel;

      const refillQuantity =
        editedRefills[product._id] || defaultRefill;

      const response = await fetch(
        "http://localhost:5000/api/purchase-orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            productId: product._id,
            productName: product.name,
            supplierName: product.supplierName,
            supplierEmail: product.supplierEmail,
            quantity: refillQuantity
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        alert("✅ Purchase Order Created Successfully");
        console.log("📦 Purchase Order:", data.order);

        getOrders();

      } else {

        alert("❌ Failed to create order");

      }

    } catch (error) {

      console.error("Purchase Order Error:", error);

    }
  };

  const totalProducts = products?.length || 0;
  const lowStock = lowStockProducts?.length || 0;
  const totalOrders = orders?.length || 0;

  return (

    <div className="dashboard-container">

      {/* Welcome Card */}

      <div className="welcome-card">

        <div>
          <h2>👋 Welcome back, {user?.name}</h2>
          <p>
            Here’s a quick overview of your inventory system performance today.
          </p>
        </div>

        <div className="admin-role-section">
          <div className="welcome-role">{user?.role}</div>
        </div>

      </div>

      {/* Stats Grid */}

      <div className="stats-grid">

        <div className="stat-card blue">
          <div className="card-header">
            <h4>Total Products</h4>
            <span className="card-icon">📦</span>
          </div>
          <h1>{totalProducts}</h1>
          <p>All inventory items</p>
        </div>

        <div className="stat-card red">
          <div className="card-header">
            <h4>Low Stock</h4>
            <span className="card-icon">⚠️</span>
          </div>
          <h1>{lowStock}</h1>
          <p>Needs restock</p>
        </div>

        <div className="stat-card purple">
          <div className="card-header">
            <h4>Total Orders</h4>
            <span className="card-icon">🧾</span>
          </div>
          <h1>{totalOrders}</h1>
          <p>All purchase requests</p>
        </div>

      </div>

      {/* LOW STOCK SECTION */}

      {lowStockProducts?.length > 0 && (

        <div className="lowstock-section">

          <h2 className="section-title">⚠ Low Stock Products</h2>

          <div className="lowstock-grid">

            {lowStockProducts.map((product) => {

              // 🔥 UPDATED SMART REORDER LOGIC
              const deficit = product.reorderLevel - product.quantity;
              const buffer = 20;
              const defaultRefill =
                deficit > 0 ? deficit + buffer : product.reorderLevel;

              const refillValue =
                editedRefills[product._id] || defaultRefill;

              const isEditing = editingProduct === product._id;

              return (

                <div className="lowstock-card" key={product._id}>

                  <h3 className="product-name">{product.name}</h3>

                  <p className="product-stock">
                    Qty: <b>{product.quantity}</b> / Threshold: {product.reorderLevel}
                  </p>

                  <p className="suggested-text">

                    Suggested Refill::

                    {isEditing ? (

                      <input
                        type="number"
                        value={refillValue}
                        className="refill-input"
                        onChange={(e) =>
                          handleRefillChange(product._id, e.target.value)
                        }
                        onBlur={() => setEditingProduct(null)}
                      />

                    ) : (

                      <>
                        <span className="suggested-number">
                          {refillValue}
                        </span>

                        <span
                          className="edit-icon"
                          onClick={() => setEditingProduct(product._id)}
                        >
                          ✏️
                        </span>
                      </>

                    )}

                  </p>

                  <button
                    className="reorder-btn"
                    onClick={() => contactSupplier(product)}
                  >
                    Contact Supplier
                  </button>

                </div>

              );

            })}

          </div>

        </div>

      )}

    </div>
  );
}