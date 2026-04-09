import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokens } from "./helper/refersh";
import { verifyAccess } from "./helper/auth";

export async function proxy(req: NextRequest) {
  const access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === "/";
  const isMainRoute = pathname.startsWith("/main");

  // 1. No tokens → allow only login page
  if (!access && !refresh) {
    if (isMainRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
   // 2. No refresh token → force logout + clear cookies
  if (!refresh) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("access");
    res.cookies.delete("refresh");
    return res;
  }

  // 3. Valid access token
  if (access && verifyAccess(access)) {
    // Logged-in users should not access login page
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/main", req.url));
    }
    return NextResponse.next();
  }


  // 4. Try refreshing tokens
  let tokens = null;
  try {
    tokens = await refreshTokens(refresh);
  } catch (err) {
    tokens = null;
  }

  // Refresh failed → logout safely
  if (!tokens) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("access");
    res.cookies.delete("refresh");
    return res;
  }

  // 5. Success → continue request (NO forced redirect → prevents loop)
  const res = NextResponse.next();

  res.cookies.set("access", tokens.newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 15, // 15 min
  });

  res.cookies.set("refresh", tokens.newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}

// Protect routes
export const config = {
  matcher: ["/", "/main/:path*"],
};