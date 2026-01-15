import axios from "axios";

// Determine BASE_URL based on environment
const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return "http://localhost:5001/api";
  }
  
  // In production, use environment variable or relative path
  return import.meta.env.VITE_API_URL || "/api";
};

const BASE_URL = getBaseURL();

console.log("API Base URL:", BASE_URL);

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;