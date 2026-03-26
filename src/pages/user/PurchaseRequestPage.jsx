import { useCart } from "../../context/CartContext";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PurchaseRequestPage() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!address.trim()) {
      alert("Please enter shipping address");
      return;
    }

    await createOrder(cartItems, totalAmount, user._id);

    clearCart();

    navigate("/user/order-success");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center gap-2 text-3xl font-bold text-gray-800 mb-6">
        🛒 Checkout
      </div>

      {/* EMPTY CART UI */}
      {cartItems.length === 0 ? (

        <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow-lg max-w-md">

          <div className="text-6xl text-gray-400 mb-4">
            🛒
          </div>

          <h2 className="text-2xl font-semibold text-gray-700">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add some products to your cart before checking out.
          </p>

          <button
            onClick={() => navigate("/user/products")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>

        </div>

      ) : (

        /* CHECKOUT CARD */

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">

          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Order Summary
          </h3>

          {/* ITEMS */}
          <div className="space-y-2">

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-2 border-b"
              >
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>

                <span className="text-gray-800 font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

          </div>

          {/* TOTAL */}

          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {/* SHIPPING FORM */}

          <form onSubmit={handleCheckout} className="mt-6">

            <label
              htmlFor="shipping"
              className="text-gray-700 font-medium"
            >
              Shipping Address
            </label>

            <textarea
              id="shipping"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Shipping Address"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold mt-4
              hover:bg-indigo-700 active:scale-95 transform transition-transform duration-200
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              Place Order
            </button>

          </form>

        </div>

      )}

    </div>
  );
}