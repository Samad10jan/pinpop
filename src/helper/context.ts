// "use server";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { cookies } from "next/headers";
import { verifyAccess, verifyRefresh } from "@/src/helper/auth";

export async function context() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  const refresh = cookieStore.get("refresh")?.value;

  // Both tokens required for authenticated requests
  if (!access || !refresh) return { user: null };

  // console.log("aaa");

  try {
    // Verify access token validity
    const decoded = verifyAccess(access);
    if (!decoded) return { user: null };

    // Verify refresh token exists (extra validation layer)
    const refreshValid = verifyRefresh(refresh);
    if (!refreshValid) return { user: null };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return { user: null };
    // console.log(user);
    const uploadCount = await prisma.pin.count({
      where: { userId: user.id },
    });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        uploadCount: uploadCount,
      },
    };

  } catch (err: any) {
    return { user: null };
  }
}

