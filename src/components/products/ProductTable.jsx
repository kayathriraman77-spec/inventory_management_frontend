import React from "react";

const ProductTable = ({ products, deleteProduct, handleEdit }) => {
  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Supplier Email</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Reorder Level</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No products added
              </td>
            </tr>
          ) : (
            products.map((product) => {
              let statusLabel = "In Stock";
              let statusClass = "in-stock";

              if (product.quantity === 0) {
                statusLabel = "Out Of Stock";
                statusClass = "out-stock";
              } else if (product.quantity <= product.reorderLevel) {
                statusLabel = "Low Stock";
                statusClass = "low-stock";
              }

              return (
                <tr
                  key={product._id}
                  
                >
                  <td>{product.name}</td>
                  <td>{product.sku || "-"}</td>
                  <td>{product.category}</td>

                  {/* ✅ FIX HERE */}
                  <td>{product.supplierName || "-"}</td>
                  <td>{product.supplierEmail || "-"}</td>
                  <td>{product.quantity}</td>
                  <td>₹ {product.price}</td>
                  <td>{product.reorderLevel}</td>
                  <td>{product.description || "-"}</td>

                  <td>
                    <span className={statusClass}>{statusLabel}</span>
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;