import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokens } from "./helper/refersh";


export async function proxy(req: NextRequest) {
    
  const access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;

  // nothing exists -> logout
  if (!access && !refresh) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // access valid -> continue
  if (access) {
    try {
      jwt.verify(access, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch {}
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

export const config = {
  matcher: ["/main/:path*"],
};
