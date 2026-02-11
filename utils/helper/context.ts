import jwt from "jsonwebtoken";
import prisma from "@/lib/services/prisma";
import { cookies } from "next/headers";

export async function context() {
  let user = null;

  const token = (await cookies()).get("access")?.value;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

    } catch (err: any) {
      // console.log("Error:", err.message);
      // If the error is related to token expiration, you might want to handle it differently
      // For example, you could check if the error is a TokenExpiredError and attempt to refresh the token

      // if (err.name === "TokenExpiredError") {
      //   // Handle token refresh logic here
      
      //   Make Api call to refresh token endpoint and update cookies
      //   
      // }
      user = null;
    }
  }

  return {
    user
      : {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      uploadCount: user?.uploadCount,
      createdAt: user?.createdAt

    }
  };
}
// use Api method