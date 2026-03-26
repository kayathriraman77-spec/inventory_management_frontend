import { createContext, useContext, useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNotifications } from "./NotificationContext";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products, setProducts] = useState([]);

  const { addNotification } = useNotifications();

  // store already notified products
  const notifiedProducts = useRef(new Set());

  /* ===============================
        FETCH PRODUCTS
  =============================== */

  const fetchProducts = async () => {

    try {

      const { data } = await axiosInstance.get("/products");

      setProducts(data);

      /* ===============================
            STOCK ALERT DETECTION
      =============================== */
data.forEach((product) => {

  const productKey = product._id;

  // OUT OF STOCK
  if (product.quantity === 0) {

    if (!notifiedProducts.current.has(productKey)) {

      addNotification(
        `❌ ${product.name} is Out Of Stock`,
        "OUT_OF_STOCK"
      );

      notifiedProducts.current.add(productKey);
    }

  }

  // LOW STOCK
  else if (product.quantity <= product.reorderLevel) {

    if (!notifiedProducts.current.has(productKey)) {

      addNotification(
        `⚠ ${product.name} stock is low (Qty: ${product.quantity})`,
        "LOW_STOCK"
      );

      notifiedProducts.current.add(productKey);
    }

  }

  // STOCK NORMAL → reset notification
  else {

    notifiedProducts.current.delete(productKey);

  }

});

    } catch (error) {

      console.error("Fetch products error:", error);

    }

  };

  /* ===============================
        ADD PRODUCT
  =============================== */

  const addProduct = async (product) => {

    try {

      const { data } = await axiosInstance.post("/products", product);

      setProducts((prev) => [...prev, data]);

    } catch (error) {

      console.error("Add product error:", error);

    }

  };

  /* ===============================
        UPDATE PRODUCT
  =============================== */

  const updateProduct = async (id, product) => {

    try {

      const { data } = await axiosInstance.put(`/products/${id}`, product);

      setProducts((prev) =>
        prev.map((item) => (item._id === id ? data : item))
      );

    } catch (error) {

      console.error("Update product error:", error);

    }

  };

  /* ===============================
        DELETE PRODUCT
  =============================== */

  const deleteProduct = async (id) => {

    try {

      await axiosInstance.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((item) => item._id !== id));

    } catch (error) {

      console.error("Delete product error:", error);

    }

  };

  /* ===============================
        ADD OR UPDATE
  =============================== */

  const addOrUpdateProduct = async (product) => {

    if (product._id) {

      await updateProduct(product._id, product);

    } else {

      await addProduct(product);

    }

  };

  /* ===============================
        LOW STOCK PRODUCTS
  =============================== */

  const lowStockProducts = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.quantity <= product.reorderLevel
  );

  /* ===============================
        AUTO REFRESH
  =============================== */

  useEffect(() => {

    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <ProductContext.Provider
      value={{
        products,
        lowStockProducts,
        addOrUpdateProduct,
        deleteProduct,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export const useProducts = () => {
  return useContext(ProductContext);
};