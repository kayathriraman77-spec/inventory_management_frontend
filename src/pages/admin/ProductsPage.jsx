import { useState } from "react";
import ProductForm from "../../components/products/ProductForm";
import ProductTable from "../../components/products/ProductTable";
import { useProducts } from "../../context/ProductContext";

const ProductsPage = () => {
  const {
    products,
    addOrUpdateProduct,
    deleteProduct,
  } = useProducts();

  const [editProduct, setEditProduct] = useState(null);

  return (
    <div className="page-container">
      <h2 className="page-title">Product Management</h2>

      <ProductForm
        addOrUpdateProduct={addOrUpdateProduct}
        editProduct={editProduct}
        cancelEdit={() => setEditProduct(null)}
      />

      <ProductTable
        products={products}
        deleteProduct={deleteProduct}
        handleEdit={setEditProduct}
      />
    </div>
  );
};

export default ProductsPage;