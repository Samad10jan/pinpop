import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokens } from "./helper/refersh";
import { verifyAccess } from "./helper/auth";


export async function proxy(req: NextRequest) {
  const access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === "/";

  // No tokens at all
  if (!access && !refresh) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Try access token first
  if (access && verifyAccess(access)) {
    // Logged in user should not see login page
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/main", req.url));
    }
    return NextResponse.next();
  }

  // No refresh token → logout
  if (!refresh) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // token rotaion: if access token is invalid but refresh token exists, try to refresh
  const tokens = await refreshTokens(refresh);

  if (!tokens) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Decide response based on route
  const response = isAuthPage
    ? NextResponse.redirect(new URL("/main", req.url))
    : NextResponse.next();

  // Set new cookies
  response.cookies.set("access", tokens.newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 15,
  });

  response.cookies.set("refresh", tokens.newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

// protecting main routes
export const config = {
  matcher: ["/", "/main/:path*"],
};
