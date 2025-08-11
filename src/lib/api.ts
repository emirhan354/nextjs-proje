// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // örn: http://localhost:3001/api
  withCredentials: true, // CORS + cookie uyumu
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // yetkisiz -> temizle ve login'e at
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; Max-Age=0; Path=/; SameSite=Lax";
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
