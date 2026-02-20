import { refreshTokens } from "@/src/helper/refersh";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  // access the refresh token from cookies
  const refresh = (await cookieStore).get("refresh")?.value;

  // if no refresh token, return 401
  if (!refresh) return NextResponse.json(null, { status: 401 });

  //using function from helper to get new tokens, if invalid refresh token, it will return null
  const tokens = await refreshTokens(refresh);

  // if tokens is null, means refresh token is invalid or user doesn't exist, return 401
  if (!tokens) return NextResponse.json(null, { status: 401 });

  // else, set new tokens in cookies and return success response
  const res = NextResponse.json({ ok: true });

  res.cookies.set("access", tokens.newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 20, // cookies should expire a bit longer than access token
  });

  res.cookies.set("refresh", tokens.newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
