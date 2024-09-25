import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AppDispatch, store } from "@/store/store";
import { logout } from "@/store/reducer/userReducer";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_ENDPOINT;

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = Cookies.get("accessToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer${token}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError): Promise<unknown> => {
  if (error.response) {
    const dispatch: AppDispatch = store.dispatch;
    if (error.response.status === 401 && error.response.data) {
      try {
        const response = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });
        const newAccessToken = response.data.accessToken;

        Cookies.set("accessToken", newAccessToken, {
          expires: 7,
        });
        if (error.config) {
          error.config.headers = error.config.headers || {};
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
  }
  return Promise.reject(error);
};

export const setupInterceptorsTo = (
  axiosInstance: AxiosInstance
): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 5000,
});

setupInterceptorsTo(axiosInstance);

export default axiosInstance;
