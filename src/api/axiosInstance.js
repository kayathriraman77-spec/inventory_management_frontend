import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// RESPONSE INTERCEPTOR (SAFE)
// ===============================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.log("Unauthorized request");

      // ❌ DO NOT redirect here
      // ❌ DO NOT clear localStorage here
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;