// This file creates a custom Axios instance that: already knows your backend URL
// always sends JSON
// automatically attaches the JWT token to every request
// So later you don’t write auth headers again and again.



import axios from "axios";
import { BASE_URL } from "./constants";

// Create a custom axios instance with default settings
const axiosInstance = axios.create({
    baseURL: BASE_URL,                 // Backend base URL
    timeout: 10000,                    // Request timeout (10s)
    headers: {
        "Content-Type": "application/json", // Default content type
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get JWT token from localStorage
        const accessToken = localStorage.getItem("token");

        // If token exists, attach it to request headers
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Return modified config so request continues
        return config;
    },
    (error) => {
        // If error occurs before request is sent
        return Promise.reject(error);
    }
);

// Export axios instance for reuse
export default axiosInstance;
