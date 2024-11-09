import axios from "axios";
import Cookies from "js-cookie";
import refreshToken from "./refreshToken";
import toast from "react-hot-toast";

const getBaseUrl = () => {
  if (Cookies.get("adminToken")) return "http://localhost:5000/admin";
  if (Cookies.get("agentToken")) return "http://localhost:5000/agent";
  return "http://localhost:5000";
};

const getToken = () =>
  Cookies.get("accessToken") ||
  Cookies.get("adminToken") ||
  Cookies.get("agentToken");

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.baseURL = getBaseUrl(); 
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken(); 
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); 
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "User Blocked"
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      toast.error(error.response?.data?.message);
      window.location.replace("/login");
    }
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Agent Blocked"
    ) {
      Cookies.remove("agentToken");
      Cookies.remove("agentRefreshToken");
      toast.error(error.response?.data?.message);
      window.location.replace("/agent");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
