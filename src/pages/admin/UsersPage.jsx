import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return <h3 className="p-6">Access Denied</h3>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔹 Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-md mb-5">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-sm opacity-90">
          View and manage all registered users
        </p>
      </div>

      {/* 🔹 Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            {/* 🔸 Table Header */}
            <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>

            {/* 🔸 Table Body */}
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b even:bg-gray-50 hover:bg-blue-50 transition duration-200"
                >
                  {/* Name */}
                  <td className="p-4 font-medium">{u.name}</td>

                  {/* Email */}
                  <td className="p-4 text-gray-600">{u.email}</td>

                  {/* Role */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        u.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        u.status === "Inactive"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;