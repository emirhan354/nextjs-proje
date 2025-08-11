// src/services/http.ts
import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // gerekiyorsa
});

// Request: Her isteğe token ekle
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: 401 gelirse token’ı temizle ve login’e at
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // İstersen backend'e logout isteği de atabilirsin ama şart değil
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default http;
