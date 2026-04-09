import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokens } from "./helper/refersh";
import { verifyAccess } from "./helper/auth";

export async function proxy(req: NextRequest) {
  const access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === "/";
  const isProtectedRoute = pathname.startsWith("/main");

  // ✅ Skip Next.js internals & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // =========================================================
  // ❌ CASE 1: No tokens at all
  // =========================================================
  if (!access && !refresh) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // =========================================================
  // ✅ CASE 2: Valid access token
  // =========================================================
  if (access && verifyAccess(access)) {
    // Logged-in user should not visit login page
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/main", req.url));
    }
    return NextResponse.next();
  }

  // =========================================================
  // ❌ CASE 3: No refresh token (logout situation)
  // =========================================================
  if (!refresh) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // =========================================================
  // 🔁 CASE 4: Try refresh token
  // =========================================================
  const tokens = await refreshTokens(refresh);

  if (!tokens) {
    // ❌ Refresh failed → treat as logged out
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // =========================================================
  // ✅ CASE 5: Refresh success
  // =========================================================
  const response = isAuthPage
    ? NextResponse.redirect(new URL("/main", req.url))
    : NextResponse.next();

  // 🔥 IMPORTANT: Add path "/" to avoid cookie issues on Vercel
  response.cookies.set("access", tokens.newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 min
  });

  response.cookies.set("refresh", tokens.newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

// =========================================================
// ✅ MATCHER (IMPORTANT)
// =========================================================
export const config = {
  matcher: ["/", "/main/:path*"],
};