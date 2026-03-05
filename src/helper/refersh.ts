import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { signAccess, signRefresh } from "@/src/helper/auth";

type RefreshPayload = {
  userId: string;
};
// function to Refresh tokens using a refresh-token , used in proxy and refresh token route:-

// proxy.ts is handling token refresh in the middleware level, it will directly return new tokens if refresh token is valid, ** without going through HTTP
// route.ts is handling token refresh in the API level, it will return new tokens in the response body if refresh token is valid, ** and client will set cookies by itself

// Refresh tokens using refresh token
export async function refreshTokens(refresh: string) {
  try {
    // verify refresh token signature
    const decoded = jwt.verify( refresh,process.env.REFRESH_SECRET! ) as RefreshPayload;

    // Check if token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refresh },
    });

    // token not found
    if (!storedToken) return null;

    // check expiration stored in DB
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { token: refresh },
      });
      return null;
    }

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
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return { newAccess, newRefresh };
  } catch {
    // invalid or expired JWT
    return null;
  }
}