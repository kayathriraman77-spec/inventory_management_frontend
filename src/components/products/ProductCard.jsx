import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {

  const { addToCart, cartItems } = useCart();

  const cartItem = cartItems.find((item) => item._id === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const availableStock = product.quantity - cartQty;

  return (

    <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-1">

      {/* PRODUCT IMAGE */}

      <img
        src={
          product.image
            ? `http://localhost:5000${product.image}`
            : "https://via.placeholder.com/300"
        }
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-xl"
      />

      <div className="p-4">

        {/* PRODUCT NAME */}

        <h3 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h3>

        {/* CATEGORY */}

        <span className="inline-block mt-1 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
          {product.category}
        </span>

        {/* DESCRIPTION */}

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description || "No description available"}
        </p>

        {/* PRICE */}

        <p className="text-indigo-600 font-bold text-lg mt-2">
          ₹ {product.price}
        </p>

        {/* STOCK STATUS */}

        {availableStock > 0 ? (
          <p className="text-green-600 font-medium text-sm">
            In Stock ({availableStock})
          </p>
        ) : (
          <p className="text-red-600 font-medium text-sm">
            Out of Stock
          </p>
        )}

        {/* ADD TO CART BUTTON */}

        {availableStock > 0 ? (
          <button
            className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition hover:scale-105 active:scale-95"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="w-full mt-3 py-2 rounded-lg bg-gray-300 cursor-not-allowed"
            disabled
          >
            Out of Stock
          </button>
        )}

      </div>

    </div>

  );
}
