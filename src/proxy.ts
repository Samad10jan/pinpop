import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokens } from "./helper/refersh";
import { verifyAccess } from "./helper/auth";


export async function proxy(req: NextRequest) {

  // access tokens from cookies
  const access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;
  const pathname = req.nextUrl.pathname;

  // nothing exists -> logout
  if (!access && !refresh) {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // access valid -> continue
  if (access) {
    const decoded = verifyAccess(access);
    if (decoded) {
      return NextResponse.next();
    }
  }

  // no refresh -> logout
  if (!refresh) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // refresh directly (NO HTTP)
  const tokens = await refreshTokens(refresh);

  if (!tokens) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next();

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
  matcher: ["/main/:path*"],
};
