import prisma from "@/lib/services/prisma";
import { hashPassword, verifyPassword, signAccess, signRefresh } from "@/utils/helper/auth";
import { cookies } from "next/headers";
import { ApiError } from "@/utils/ApiError";

export const signup = async (_: any, args: any) => {
    return await prisma.$transaction(async (tn) => {

        if (!args.name || !args.email || !args.password)
            throw new ApiError(400, "All fields required");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(args.email))
            throw new ApiError(400, "Invalid email format");

        if (args.password.length < 8)
            throw new ApiError(400, "Password must be at least 8 characters");

        const exists = await tn.user.findUnique({
            where: { email: args.email }
        });

        if (exists) throw new ApiError(400, "Email already exists");

        const hashed = await hashPassword(args.password);

        const user = await tn.user.create({
            data: {
                name: args.name,
                email: args.email,
                passwordHash: hashed,
                avatar: args.avatar
            }
        });

        const access = signAccess(user.id);
        const refresh = signRefresh(user.id);

        await tn.user.update({
            where: { id: user.id },
            data: { refreshToken: refresh }
        });

        const cookieStore = await cookies();

        cookieStore.set("access", access, {
            httpOnly: true,
            sameSite: "lax"
        });

        cookieStore.set("refresh", refresh, {
            httpOnly: true,
            sameSite: "lax"
        });

        return { user };
    });
}
export const login = async (_: any, args: any) => {

    return await prisma.$transaction(async (tn) => {

        const user = await tn.user.findUnique({

            where: { email: args.email }
        });

        if (!user) throw new ApiError(400, "Invalid credentials");

        const ok = await verifyPassword(args.password, user.passwordHash);
        if (!ok) throw new ApiError(400,"Invalid credentials");

        const access = signAccess(user.id);
        const refresh = signRefresh(user.id);

        await tn.user.update({
            where: { id: user.id },
            data: { refreshToken: refresh }
        });

        const cookieStore = await cookies();

        cookieStore.set("access", access, {
            httpOnly: true,
            sameSite: "lax"
        });

        cookieStore.set("refresh", refresh, {
            httpOnly: true,
            sameSite: "lax"
        });

        return { user };
    });
}



