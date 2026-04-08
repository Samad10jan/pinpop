// "use server";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { cookies } from "next/headers";

export async function context() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  // console.log("access",access);


  if (!access) return { user: null };
  // console.log("aaa");



  try {
    const decoded: any = jwt.verify(access, process.env.JWT_SECRET!);
    //  console.log("aaa");

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
        // createdAt: user.createdAt,
      },
    };

  } catch (err: any) {
    //  console.log("aaa",err.message);
    return { user: null };
  }
}

