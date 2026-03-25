import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { cookies } from "next/headers";

// Work is to get user info from access token in cookies, and return it in the context, so that all Resolvers can access user info without verifying token again and again.
export async function context() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

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

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        uploadCount: user.uploadCount,
        // createdAt: user.createdAt,
      },
    };

  } catch(err: any) {
    //  console.log("aaa",err.message);
    return { user: null };
  }
}

