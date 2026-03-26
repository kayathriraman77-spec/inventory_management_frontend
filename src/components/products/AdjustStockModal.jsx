import { useState } from "react";
import axios from "axios";

const AdjustStockModal = ({ product, onClose, onSuccess }) => {
  const [adjustmentType, setAdjustmentType] = useState("Add Stock");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    try {
      if (quantity < 0) {
        alert("Invalid quantity");
        return;
      }

      if (!reason.trim()) {
        alert("Reason required");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/products/adjust/${product._id}`,
        {
          adjustmentType,
          quantity: Number(quantity),
          reason,
        }
      );

      onSuccess(); // refresh
      onClose();   // close modal

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Adjust Stock
        </h2>

        {/* Product Name */}
        <p className="mb-2">
          <strong>Product:</strong> {product.name}
        </p>

        {/* Current Qty */}
        <p className="mb-4">
          <strong>Current Qty:</strong> {product.quantity}
        </p>

        {/* Type */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={adjustmentType}
          onChange={(e) => setAdjustmentType(e.target.value)}
        >
          <option>Add Stock</option>
          <option>Remove Stock</option>
          <option>Defective</option>
          <option>Manual Correction</option>
        </select>

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity"
          className="w-full border p-2 mb-3 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* Reason */}
        <input
          type="text"
          placeholder="Reason"
          className="w-full border p-2 mb-4 rounded"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdjustStockModal;