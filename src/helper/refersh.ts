import jwt from "jsonwebtoken";
import prisma from "@/src/lib/services/prisma";
import { signAccess, signRefresh } from "@/src/helper/auth";

// function to Refresh tokens using a refresh-token , used in proxy and refresh token route:-

// proxy.ts is handling token refresh in the middleware level, it will directly return new tokens if refresh token is valid, ** without going through HTTP
// route.ts is handling token refresh in the API level, it will return new tokens in the response body if refresh token is valid, ** and client will set cookies by itself
export async function refreshTokens(refresh: string) {

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // if user doesn't exist or refresh token doesn't match, return null
    if (!user || user.refreshToken !== refresh) return null;

    // else, generate new tokens
    const newAccess = signAccess(user.id);
    const newRefresh = signRefresh(user.id);

    // save new refresh token in db
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    });

    // return new tokens
    return { newAccess, newRefresh };

  } catch {
    return null;
  }
}
