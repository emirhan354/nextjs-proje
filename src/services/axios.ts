// src/services/axios.ts
import axios, { AxiosError } from "axios";

// .env.local -> NEXT_PUBLIC_API_URL=http://localhost:3001/api
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true,
  timeout: 20000,
  // Yalnızca 2xx başarı saysın; diğerleri catch'e düşsün
  validateStatus: (s) => s >= 200 && s < 300,
});

// İsteklere token ekle (TS güvenli)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // headers objesini garanti et ve tip uyuşmazlığını önlemek için mutasyon yap
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch {
      /* no-op */
    }
  }
  return config;
});

// 401'de akıllı yönlendirme (login çağrısını ve login sayfasını es geç)
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;

    // SSR ortamında ya da 401 değilse: aynen fırlat
    if (typeof window === "undefined" || status !== 401) {
      return Promise.reject(error);
    }

    // İstek URL'sini normalize et (relative/absolute fark etmesin)
    const reqUrl = (() => {
      const raw = (error.config?.url || "").toString();
      if (!raw) return "";
      try {
        const abs = new URL(
          raw,
          error.config?.baseURL || window.location.origin
        );
        return abs.pathname + abs.search;
      } catch {
        return raw;
      }
    })();

    const isLoginCall = /\/auth\/login(?:\?|$)/.test(reqUrl);
    const onLoginPage = window.location.pathname.startsWith("/login");

    // Login isteği sırasında veya login sayfasındayken redirect yapma
    if (isLoginCall || onLoginPage) {
      return Promise.reject(error);
    }

    // Token'ı temizle ve login'e yönlendir
    try {
      localStorage.removeItem("token");
    } catch {
      /* no-op */
    }
    if (typeof document !== "undefined") {
      document.cookie = "token=; Max-Age=0; Path=/; SameSite=Lax";
    }
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
