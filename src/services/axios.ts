// src/services/axios.ts
import axios, { AxiosError } from "axios";

// .env.local -> NEXT_PUBLIC_API_URL=http://localhost:3001/api
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 20000,
  // 4xx/5xx'leri catch'e düşür
  validateStatus: (s) => s >= 200 && s < 300,
});

// İsteklere token ekle
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// 401'de akıllı yönlendirme
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status !== 401 || typeof window === "undefined") {
      return Promise.reject(error);
    }

    // İstek URL'sini kesin tespit et (relative/absolute fark etmez)
    const reqUrl = (() => {
      const u = (error.config?.url || "").toString();
      if (!u) return "";
      // absolute ise path'i al, değilse direkt u
      try {
        const abs = new URL(u, error.config?.baseURL || window.location.origin);
        return abs.pathname + abs.search;
      } catch {
        return u;
      }
    })();

    const isLoginCall = /\/auth\/login(?:\?|$)/.test(reqUrl);
    const onLoginPage = window.location.pathname.startsWith("/login");

    // Login denemesinde veya login sayfasındayken redirect yapma
    if (isLoginCall || onLoginPage) {
      return Promise.reject(error);
    }

    // Token'ı temizle ve login'e gönder
    try {
      localStorage.removeItem("token");
    } catch {}
    // middleware için cookie'yi de sil
    document.cookie = "token=; Max-Age=0; Path=/; SameSite=Lax";

    window.location.href = "/login";
    return Promise.reject(error);
  }
);
