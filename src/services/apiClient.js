import { message } from "antd";
import axios from "axios";
import { useLogout } from "../context/AuthContext";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data.result;
  },
  (error) => {
    if (!error.response) {
      console.error(error.message);
      message.error(
        "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng."
      );
    } else {
      if (error.response.data.code === 16) {
        const logout = useLogout();
        logout();
      }
      console.error("Response error:", error.response.data.message);
      return Promise.reject(error.response.data);
    }
  }
);

export default apiClient;
