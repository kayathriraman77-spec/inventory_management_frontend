import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart, totalAmount, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-3xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          My Cart
        </h2>

        {cartItems.length === 0 ? (

          /* EMPTY CART UI */

          <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow-lg">

            <div className="text-6xl mb-4 text-gray-400">
              🛒
            </div>

            <h3 className="text-2xl font-semibold text-gray-700">
              Your Cart is Empty
            </h3>

            <p className="text-gray-500 mt-2">
              Add some products before checking out.
            </p>

            <button
              onClick={() => navigate("/user/products")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <>
            {/* CART ITEMS */}

            <div className="space-y-4">

              {cartItems.map((item) => (

                <div
                  key={item._id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                >

                  {/* LEFT SIDE */}
                  <div>

                    <p className="font-semibold text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-gray-600">
                      Price: ₹{item.price}
                    </p>

                    {/* QUANTITY CONTROLS */}

                    <div className="flex items-center gap-3 mt-2">

                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        -
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        +
                      </button>

                    </div>

                    <p className="text-gray-800 mt-2 font-medium">
                      Total: ₹{item.price * item.quantity}
                    </p>

                  </div>

                  {/* REMOVE BUTTON */}

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            {/* TOTAL SECTION */}

            <div className="bg-white rounded-lg shadow p-6 mt-6">

              <div className="flex justify-between text-lg font-semibold text-gray-800">
                <span>Grand Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <button
                onClick={() => navigate("/user/purchase-request")}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transform transition"
              >
                Proceed to Checkout
              </button>

            </div>

          </>
        )}

      </div>

    </div>
  );
}