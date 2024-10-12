import axios from "axios";
import Cookies from "js-cookie";

async function refreshToken() {
  
    try {
      const res = await axios.post("http://localhost:5000/agent/refresh-token", {
        refreshToken: Cookies.get("refreshToken"),
      });
      const { accessToken } = res.data;
      Cookies.set("accessToken", accessToken); 
      return accessToken;
    } catch (error) {
      console.error("Refresh token failed", error);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/agent";
      throw new Error ("Refresh token expired. Please log in again.");
    }
  }
const axiosInstance = axios.create({
  baseURL:'http://localhost:5000' ,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const newToken = await refreshToken();
          const originalRequest = error.config;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
export default axiosInstance;
