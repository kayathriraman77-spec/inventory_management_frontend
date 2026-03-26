import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import ProductCard from "../../components/products/ProductCard";

export default function ViewProductsPage() {

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products", err);
    }
  };

  useEffect(() => {

    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 4000);

    return () => clearInterval(interval);

  }, []);

  /* ---------------- FILTER LOGIC ---------------- */

  const categories = [
    "All",
    "Grocery",
    "Electronics",
    
    "Beauty",
    "Appliances"
  ];

  const filteredProducts = products.filter((product) => {

    const matchCategory =
      category === "All" || product.category === category;

    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;

  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Browse Products
        </h2>

        {/* SEARCH BAR */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-300 outline-none"
          />

        </div>

        {/* CATEGORY FILTER */}

        <div className="flex flex-wrap gap-3 mb-8">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full shadow text-sm transition hover:scale-105
              
              ${category === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

        {/* PRODUCTS GRID */}

        {filteredProducts.length === 0 ? (

          <p className="text-gray-600">
            No products found
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

      </div>

    </div>
  );
}
