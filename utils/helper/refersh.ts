import jwt from "jsonwebtoken";
import prisma from "@/lib/services/prisma";
import { signAccess, signRefresh } from "@/utils/helper/auth";

export async function refreshTokens(refresh: string) {
  try {
    const decoded = jwt.verify( refresh, process.env.REFRESH_SECRET! ) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refresh) return null;

    const newAccess = signAccess(user.id);
    const newRefresh = signRefresh(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    });

    return { newAccess, newRefresh };
    
  } catch {
    return null;
  }
}
