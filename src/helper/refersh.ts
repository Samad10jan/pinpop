import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { signAccess, signRefresh, verifyRefresh } from "@/src/helper/auth";

type RefreshPayload = {
  userId: string;
};


export async function refreshTokens(refresh: string) {
  try {
    // verify refresh token signature + expiry (handled by JWT itself)
   
    const decoded = verifyRefresh(refresh);
    if (!decoded) return null;

    // Check if token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refresh },
    });

    // token not found
    if (!storedToken) return null;

    const userId = storedToken.userId;

    // generate new tokens
    const newAccess = signAccess(userId);
    const newRefresh = signRefresh(userId);

    // rotate refresh token
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: { token: refresh },
      }),
      prisma.refreshToken.create({
        data: {
          token: newRefresh,
          userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // new 7-day expiry
        },
      }),
    ]);

    return { newAccess, newRefresh };
  } catch {
    // invalid or expired JWT
    return null;
  }
}