import jwt from "jsonwebtoken";
import prisma from "@/lib/services/prisma";
import { cookies } from "next/headers";

export async function context() {
  let user = null;
  const cookieStore = await cookies();

  const access = cookieStore.get("access")?.value;

  if (!access) return { user: null };

  try {

    const decoded: any = jwt.verify(access, process.env.JWT_SECRET!);

    user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

  } catch (err: any) {

    if (err.name === "TokenExpiredError") {

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/refreshToken`, {
        method: "POST",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      if (!res.ok) return { user: null };

      const data = await res.json();

      // got access token and refresh token is valid
      if (data?.access) {
        const decoded: any = jwt.verify(data.access, process.env.JWT_SECRET!);

        user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
      }
    }
  }

  // if access token is invalid and refresh token is also invalid/expired, user will be null
  if (!user) return { user: null };

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      uploadCount: user.uploadCount,
      createdAt: user.createdAt,
    },
  };
}
