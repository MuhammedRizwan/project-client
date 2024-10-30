import axios from "axios";
import Cookies from "js-cookie";
import refreshToken from "./refreshToken";

const getBaseUrl = () => {
  if (Cookies.get("adminToken")) return "http://localhost:5000/admin";
  if (Cookies.get("agentToken")) return "http://localhost:5000/agent";
  return "http://localhost:5000";
};

const getToken = () =>
  Cookies.get("accessToken") ||
  Cookies.get("adminToken") ||
  Cookies.get("agentToken");
 
const axiosInstance = axios.create({
  baseURL: getBaseUrl()
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to Handle 401 Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken(); // Refresh token on 401
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;