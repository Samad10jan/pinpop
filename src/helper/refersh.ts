import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { signAccess, signRefresh } from "@/src/helper/auth";

// function to Refresh tokens using a refresh-token , used in proxy and refresh token route:-

// proxy.ts is handling token refresh in the middleware level, it will directly return new tokens if refresh token is valid, ** without going through HTTP
// route.ts is handling token refresh in the API level, it will return new tokens in the response body if refresh token is valid, ** and client will set cookies by itself
export async function refreshTokens(refresh: string) {

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET!) as any;

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refresh },
      include: { user: true }
    });

    // if token doesn't exist, expired manually, or user missing
    if (!storedToken || !storedToken.user) return null;

    // if expired in DB
    if (storedToken.expiresAt < new Date()) {
      
      await prisma.refreshToken.delete({
        where: { token: refresh }
      });
      return null;
    }

    // else, generate new tokens
    const newAccess = signAccess(storedToken.user.id);
    const newRefresh = signRefresh(storedToken.user.id);

    // delete old refresh token (rotation)
    await prisma.refreshToken.delete({
      where: { token: refresh }
    });

    // save new refresh token in db
    await prisma.refreshToken.create({
      data: {
        token: newRefresh,
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // return new tokens
    return { newAccess, newRefresh };

  } catch {
    return null;
  }
}