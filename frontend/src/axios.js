// frontend/src/axios.js
import axios from "axios";

// Get or create persistent userId
let userId = localStorage.getItem("thinkboardUserId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("thinkboardUserId", userId);
}

// Set base URL depending on environment
const BASE_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:5001/api" 
  : "/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach userId to all requests automatically
api.interceptors.request.use((config) => {
  config.headers["X-User-Id"] = userId; // custom header for backend
  return config;
});

export default api;
