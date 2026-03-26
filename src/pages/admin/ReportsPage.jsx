import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

export default function ReportsPage() {

  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const { data } = await axiosInstance.get("/products/reports");
    setProducts(data.products);
    setSummary(data.summary);
  };

  // 🔥 TOP 5 LOW STOCK PRODUCTS
  const topProducts = [...products]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  // GROUP CATEGORY
  const grouped = products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // PIE DATA
  const categoryData = Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key].length
  }));

  // LOW STOCK
  const lowStock = products
    .filter(p => p.quantity <= p.reorderLevel)
    .slice(0, 5);

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Inventory Reports</h2>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            PDF
          </button>

          <button
            onClick={() => {
              const rows = products.map(p => `${p.name},${p.quantity},${p.price}`);
              const blob = new Blob([["Name,Qty,Price\n", ...rows].join("")]);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "report.csv";
              a.click();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            CSV
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-4 gap-5">
        <Card title="Total Products" value={summary.totalProducts} color="from-blue-500 to-indigo-600"/>
        <Card title="Low Stock" value={summary.lowStock} color="from-orange-400 to-yellow-500"/>
        <Card title="Out Of Stock" value={summary.outOfStock} color="from-red-500 to-pink-600"/>
        
      </div>

      {/* SELECTED CATEGORY */}
      {selectedCategory && (
        <div className="mt-4 text-sm">
          Showing: <b>{selectedCategory}</b>
          <button
            onClick={() => setSelectedCategory(null)}
            className="ml-3 text-blue-600 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* 🔥 LOW STOCK BAR CHART */}
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-center font-semibold mb-3">Top 5 Low Stock Products</h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" angle={-30} textAnchor="end"/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#FB923C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DONUT CHART */}
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">

          <h3 className="text-center font-semibold mb-3">Category Distribution</h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>

              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                activeOuterRadius={130}
                paddingAngle={3}
                onClick={(data) => setSelectedCategory(data.name)}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

          <div className="text-center mt-2">
            <h2 className="font-bold text-lg text-gray-700">
              {selectedCategory || "All Categories"}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* CATEGORY WISE */}
      <div className="mt-10 space-y-6">

        {Object.keys(grouped).map(category => {

          if (selectedCategory && category !== selectedCategory) return null;

          return (
            <div key={category} className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition">

              <h3 className="font-bold mb-3">{category}</h3>

              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {grouped[category].map(p => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">

                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.quantity}</td>
                      <td className="p-2">₹{p.price}</td>

                      <td className="p-2">
                        {p.quantity === 0 ? (
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Out of Stock</span>
                        ) : p.quantity <= p.reorderLevel ? (
                          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">Low Stock</span>
                        ) : (
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">In Stock</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          );
        })}

      </div>

      {/* LOW STOCK ALERT UI */}
      <div className="mt-10">

        <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
          ⚠️ Low Stock Alerts
        </h3>

        <div className="grid md:grid-cols-2 gap-5 max-h-80 overflow-y-auto pr-2">

          {lowStock.map(p => {

            const percent = (p.quantity / p.reorderLevel) * 100;

            return (
              <div
                key={p._id}
                className="bg-white border-l-4 border-red-500 p-4 rounded-xl shadow hover:shadow-lg transition"
              >

                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{p.name}</h4>

                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    Low
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  Qty: <b>{p.quantity}</b> / {p.reorderLevel}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-red-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

              </div>
            );
          })}

          {lowStock.length === 0 && (
            <div className="text-green-600 font-medium">
              ✅ All products are healthy!
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

const Card = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl text-white bg-gradient-to-r ${color} shadow hover:scale-105 transition`}>
    <h4>{title}</h4>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);