import { refreshTokens } from "@/utils/helper/refersh";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const refresh = (await cookieStore).get("refresh")?.value;

  if (!refresh) return NextResponse.json(null, { status: 401 });

  const tokens = await refreshTokens(refresh);

  if (!tokens) return NextResponse.json(null, { status: 401 });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("access", tokens.newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 15,
  });

  res.cookies.set("refresh", tokens.newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
