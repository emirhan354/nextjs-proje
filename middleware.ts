// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard"]; // Gerekirse başka korumalı yollar ekle

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // 1) Korunan sayfa ve token yoksa => /login'e gönder
  if (isProtected && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  // 2) Login/Register'da iken token varsa => /dashboard'a gönder
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Çalışacağı path'leri belirle
export const config = {
  matcher: ["/dashboard", "/login", "/register"],
};
