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

  const [editedRefills, setEditedRefills] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);

  const [defectiveData, setDefectiveData] = useState({
    totalDefective: 0,
    records: [],
  });

  const [showDefective, setShowDefective] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    const fetchDefective = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/defective");
        const data = await res.json();
        setDefectiveData(data);
      } catch (err) {
        console.error("Error fetching defective data", err);
      }
    };

    fetchDefective();
  }, []);

  const handleRefillChange = (productId, value) => {
    setEditedRefills((prev) => ({
      ...prev,
      [productId]: value
    }));
  };

  /* ===============================
        CONTACT SUPPLIER (LOW STOCK)
  =============================== */

  const contactSupplier = async (product) => {
    try {

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
        getOrders();
      } else {
        alert("❌ Failed to create order");
      }

    } catch (error) {
      console.error("Purchase Order Error:", error);
    }
  };

  /* ===============================
        🔥 NEW FUNCTION ADDED
  =============================== */

  const createDefectiveOrder = async (item) => {
    try {

      const defectiveQty = item.oldQuantity - item.newQuantity;

      const response = await fetch(
        "http://localhost:5000/api/purchase-orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productId: item.productId,
            productName: item.productName,
            supplierName: item.supplierName,
            supplierEmail: item.supplierEmail,
            quantity: defectiveQty
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("✅ Purchase Order Created for Defective Product");
        getOrders();
      } else {
        alert("❌ Failed to create order");
      }

    } catch (error) {
      console.error("Defective Order Error:", error);
    }
  };

  const totalProducts = products?.length || 0;
  const lowStock = lowStockProducts?.length || 0;
  const totalOrders = orders?.length || 0;

  return (

    <div className="dashboard-container">

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

        <div
          className="stat-card orange"
          onClick={() => setShowDefective(true)}
          style={{ cursor: "pointer" }}
        >
          <div className="card-header">
            <h4>Defective Products</h4>
            <span className="card-icon">❌</span>
          </div>
          <h1>{defectiveData.totalDefective}</h1>
          <p>Damaged / defective items</p>
        </div>

      </div>

      {/* LOW STOCK SAME AS BEFORE */}

      {lowStockProducts?.length > 0 && (
        <div className="lowstock-section">
          <h2 className="section-title">⚠ Low Stock Products</h2>
          <div className="lowstock-grid">
            {lowStockProducts.map((product) => {

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
                    Suggested Refill:
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

      {/* DEFECTIVE POPUP */}

      {showDefective && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[500px] max-h-[80vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4 text-red-600">
              Defective Products
            </h2>

            {defectiveData.records.map((item) => (
              <div key={item._id} className="border p-3 mb-3 rounded-lg">

                <p><b>Product:</b> {item.productName}</p>

                <p>
                  <b>Defective Qty:</b>{" "}
                  {item.oldQuantity - item.newQuantity}
                </p>

                <p><b>Reason:</b> {item.reason}</p>

                {/* EXISTING MAIL */}
                <button
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => {
                    if (item.supplierEmail) {
                      const subject = `Regarding Defective Product - ${item.productName}`;
                      const body = `Hello,\n\nWe found defective items for ${item.productName}.\nPlease assist.\n\nThank you.`;

                      window.open(
                        `https://mail.google.com/mail/?view=cm&to=${item.supplierEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                        "_blank"
                      );
                    } else {
                      alert("Supplier email not available");
                    }
                  }}
                >
                  Contact Supplier
                </button>

                {/* 🔥 NEW BUTTON */}
                <button
                  className="mt-2 ml-2 px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => createDefectiveOrder(item)}
                >
                  Create Order
                </button>

              </div>
            ))}

            <button
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded"
              onClick={() => setShowDefective(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}