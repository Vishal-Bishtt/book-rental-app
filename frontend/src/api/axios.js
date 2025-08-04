// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your actual backend URL
  withCredentials: true, // Needed for cookie-based auth or sessions
});

// Add access token if you're using JWT (Optional enhancement)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or use context or cookie if applicable
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axios.js - Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
