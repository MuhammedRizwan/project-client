import axios from "axios";
import Cookies from "js-cookie";
import refreshToken from "./refreshToken";
import toast from "react-hot-toast";
import { store } from "@/store/store";
import { logout as userLogout } from "@/store/reducer/userReducer";
import { logout as agentLogout } from "@/store/reducer/agentReducer";

const getBaseUrl = () => {
  if (Cookies.get("adminToken")) return process.env.NEXT_PUBLIC_API_ADMIN_URL;
  if (Cookies.get("agentToken")) return process.env.NEXT_PUBLIC_API_AGENT_URL;
  return process.env.NEXT_PUBLIC_API_BASE_URL;
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
      store.dispatch(userLogout());
      toast.error(error.response?.data?.message);
      window.location.replace("/login");
    }
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Agent Blocked"
    ) {
      Cookies.remove("agentToken");
      Cookies.remove("agentRefreshToken");
      store.dispatch(agentLogout());
      toast.error(error.response?.data?.message);
      window.location.replace("/agent");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
