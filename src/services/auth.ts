// src/services/auth.ts
import { api } from "./axios";

export type AuthUser = {
  id: number;
  email: string;
  iat?: number; // issued-at (saniye)
  exp?: number; // expiry (saniye)
};

export type LoginResponse = {
  message: string;
  token: string;
};

export type ProfileResponse = {
  message: string;
  user: AuthUser;
};

/** middleware'in okuyacağı cookie */
function setAuthCookie(token?: string, maxAgeSec = 1200) {
  if (typeof document === "undefined") return;
  if (!token) {
    document.cookie = "token=; Max-Age=0; Path=/; SameSite=Lax";
  } else {
    document.cookie = `token=${encodeURIComponent(
      token
    )}; Max-Age=${maxAgeSec}; Path=/; SameSite=Lax`;
    // prod HTTPS'te ; Secure ekleyebilirsin
  }
}

/** Giriş */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  // baseURL http://localhost:3001/api ise => burada /auth/login demek yeterli
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  if (typeof window !== "undefined" && data?.token) {
    localStorage.setItem("token", data.token); // axios interceptor için
    setAuthCookie(data.token, 1200); // middleware için (20 dk)
  }
  return data;
}

/** Çıkış */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    setAuthCookie(undefined); // cookie temizle
  }
}

/** Profil */
export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>("/profile");
  return data;
}
