import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookieName } from "@/lib/auth/jwt";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(getAuthCookieName())?.value;

  // 1. Jika user SUDAH login dan mencoba akses /login atau /
  // Kita tendang ke dashboard agar halaman login tidak muncul lagi
  if (token && (pathname === "/login" || pathname === "/")) {
    // Gunakan URL statis dulu untuk tes agar tidak loop
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Jika user BELUM login dan mencoba akses halaman ber-proteksi
  const isProtected = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/student") || 
    pathname.startsWith("/teacher") || 
    pathname.startsWith("/admin");

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Masukkan semua path yang ingin dipantau middleware
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/admin/:path*",
  ],
};