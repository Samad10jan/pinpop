import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/services/prisma";
import { cookies } from "next/headers";
import { signAccess, signRefresh } from "@/utils/helper/auth";

export async function POST() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) return NextResponse.json(null);

  // decode expired access
  const decoded = jwt.decode(access) as {id:string,iat:string} | null;

  if (!decoded?.id) return NextResponse.json(null);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user?.refreshToken) return NextResponse.json(null);

  try {

    jwt.verify(user.refreshToken, process.env.REFRESH_SECRET!);

    // ROTATE tokens
    const newAccess = signAccess(user.id);
    const newRefresh = signRefresh(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    });

    cookieStore.set("access", newAccess, {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    });

    return NextResponse.json({ access: newAccess });

  } catch {
    return NextResponse.json(null);
  }
}
