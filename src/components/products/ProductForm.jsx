import React, { useState, useEffect } from "react";

const ProductForm = ({ addOrUpdateProduct, editProduct, cancelEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "General",
    quantity: "",
    price: "",
    reorderLevel: "",
    supplierName: "",
    supplierEmail: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || "",
        sku: editProduct.sku || "",
        category: editProduct.category || "General",
        quantity: editProduct.quantity || "",
        price: editProduct.price || "",
        reorderLevel: editProduct.reorderLevel || 5,
        supplierName: editProduct.supplierName || "",
        supplierEmail: editProduct.supplierEmail || "",
        description: editProduct.description || "",
        image: editProduct.image || "",
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.price) return;

    const productData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      reorderLevel: Number(formData.reorderLevel),
    };

    // 🔍 DEBUG (you can remove later)
    console.log("Submitting:", productData);

    if (editProduct) {
      await addOrUpdateProduct({
        ...productData,
        _id: editProduct._id,
      });
    } else {
      await addOrUpdateProduct(productData);
    }

    // ✅ FIXED RESET (IMPORTANT)
    setFormData({
      name: "",
      sku: "",
      category: "General", // ✅ FIX HERE
      quantity: "",
      price: "",
      reorderLevel: "",
      supplierName: "",
      supplierEmail: "",
      description: "",
      image: "",
    });

    if (cancelEdit) cancelEdit();
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="sku"
        placeholder="SKU Code"
        value={formData.sku}
        onChange={handleChange}
      />

      <select
        name="category"
        value={formData.category || "General"} // ✅ EXTRA SAFE FIX
        onChange={handleChange}
      >
        <option value="General">General</option> {/* ✅ added */}
        <option value="Electronics">Electronics</option>
        <option value="Grocery">Grocery</option>
        <option value="Beauty">Beauty</option>
        <option value="Appliances">Appliances</option>
      </select>

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />

      <input
        type="number"
        name="reorderLevel"
        placeholder="Reorder Level"
        value={formData.reorderLevel}
        onChange={handleChange}
      />

      <input
        type="text"
        name="supplierName"
        placeholder="Supplier Name"
        value={formData.supplierName}
        onChange={handleChange}
      />

      <input
        type="email"
        name="supplierEmail"
        placeholder="Supplier Email"
        value={formData.supplierEmail}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <input
        type="text"
        name="image"
        placeholder="Image Path (example: /uploads/rice.png)"
        value={formData.image}
        onChange={handleChange}
      />

      <button type="submit">
        {editProduct ? "Update Product" : "Add Product"}
      </button>

      {editProduct && (
        <button type="button" onClick={cancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProductForm;