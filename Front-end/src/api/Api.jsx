import axios from "axios";
import { toast } from "react-hot-toast";


// api and axios instance
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    return config; // request config
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      const message = error.response?.data?.message || "An error occurred";
      // Don't show toast here, let components handle it
      return Promise.reject(error);
    } else if (error.request) {
      // Request was made but no response received
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    } else {
      // Something else happened
      toast.error("An unexpected error occurred");
      return Promise.reject(error);
    }
  }
);


// token function
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export default api;