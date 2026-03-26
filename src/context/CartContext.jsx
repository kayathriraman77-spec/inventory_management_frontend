import { createContext, useContext, useEffect, useState } from "react";
import { useProducts } from "./ProductContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { products } = useProducts();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Persist cart in localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Sync stock with latest products after refresh
  useEffect(() => {
    if (!products || products.length === 0) return;

    setCartItems((prevCart) =>
      prevCart.map((item) => {
        const latestProduct = products.find(
          (p) => p._id === item._id
        );

        if (!latestProduct) return item;

        return {
          ...item,
          stockAvailable: latestProduct.quantity,
        };
      })
    );
  }, [products]);

  // ✅ Add to Cart
  const addToCart = (product) => {
    const existing = cartItems.find((item) => item._id === product._id);

    if (existing) {
      if (existing.quantity >= existing.stockAvailable) return;

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.quantity === 0) return;

      setCartItems((prev) => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stockAvailable: product.quantity,
          quantity: 1,
        },
      ]);
    }
  };

  // ✅ Increase Quantity
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          if (item.quantity >= item.stockAvailable) return item;
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  // ✅ Decrease Quantity
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ✅ Remove Item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // ✅ Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Total Amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ✅ Total Items Count
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};