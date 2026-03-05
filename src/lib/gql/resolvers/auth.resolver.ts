import prisma from "@/src/lib/services/prisma";
import { hashPassword, verifyPassword, signAccess, signRefresh } from "@/src/helper/auth";
import { cookies } from "next/headers";
import { ApiError } from "@/src/helper/ApiError";
import { generateOTP, sendSignUpSuccessMessage, sendVerificationCode } from "@/src/helper/email";
import { UserType } from "@/src/types/types";

// Mutations
export async function signup(_: any, args: any) {

    if (!args.name || !args.email || !args.password || !args.otp)
        throw new ApiError(400, "All fields required");

    //  Find OTP record
    const record = await prisma.emailVerification.findUnique({
        where: { email: args.email }
    });

    if (!record) {
        throw new ApiError(400, "Please request OTP first");
    }

    //  Check expiry
    if (record.expiresAt < new Date()) {
        await prisma.emailVerification.delete({
            where: { email: args.email }
        });
        throw new ApiError(400, "OTP expired. Please request a new one.");
    }

    //  Validate OTP
    const isValid = await verifyPassword(args.otp, record.otp);

    if (!isValid)
        throw new ApiError(400, "Invalid OTP");

    //  Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: args.email }
    });

    if (existingUser)
        throw new ApiError(400, "User already exists");

    //  Hash password
    const hashed = await hashPassword(args.password);

    //  Create user
    const user = await prisma.user.create({
        data: {
            name: args.name,
            email: args.email,
            passwordHash: hashed,
            avatar: args.avatar
        }
    });

    await prisma.emailVerification.deleteMany({
        where: { email: args.email }
    });

    // Generate tokens
    const access = signAccess(user.id);
    const refresh = signRefresh(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
        data: {
            token: refresh,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    // Limit to 5 sessions
    const sessions = await prisma.refreshToken.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
    });

    if (sessions.length > 5) {
        const toDelete = sessions.slice(0, sessions.length - 5);

        await prisma.refreshToken.deleteMany({
            where: {
                id: {
                    in: toDelete.map(s => s.id),
                },
            },
        });
    }

    //  Set cookies
    const cookieStore = await cookies();

    cookieStore.set("access", access, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 15,
    });

    cookieStore.set("refresh", refresh, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });

    try {
        await sendSignUpSuccessMessage(args.email);
    } catch (err) {
        console.error("Welcome email failed:", err);
    }

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            uploadCount: user.uploadCount,
            createdAt: user.createdAt,
        }
    };
}


export async function login(_: any, args: any) {

    return await prisma.$transaction(async (tn) => {

        // find user by email
        const user = await tn.user.findUnique({
            where: { email: args.email }
        });

        // if user not found
        if (!user) throw new ApiError(400, "Invalid credentials");

        // verify password
        const ok = await verifyPassword(args.password, user.passwordHash);
        if (!ok) throw new ApiError(400, "Invalid credentials");

        // generate tokens
        const access = signAccess(user.id);
        const refresh = signRefresh(user.id);

        // store refresh token in DB
        await tn.refreshToken.create({
            data: {
                token: refresh,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        // get all active sessions for the user
        const sessions = await tn.refreshToken.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "asc" }, // oldest first
        });

        // keep only latest 5 sessions
        if (sessions.length > 5) {
            const toDelete = sessions.slice(0, sessions.length - 5);

            await tn.refreshToken.deleteMany({
                where: {
                    id: {
                        in: toDelete.map(s => s.id),
                    },
                },
            });
        }

        const cookieStore = await cookies();

        // set access token cookie
        cookieStore.set("access", access, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 15, // 15 minutes
        });

        // set refresh token cookie
        cookieStore.set("refresh", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // return user info
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                uploadCount: user.uploadCount,
                createdAt: user.createdAt,
            }
        };
    });
}

// Check user existence,
// OTP validity, and send OTP to email. 
// Save otp in db with expiry. 
// Upsert OTP record to prevent multiple valid OTPs.
export async function sendSignupOtp(_: any, args: any) {

    if (!args.email)
        throw new ApiError(400, "Email required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email))
        throw new ApiError(400, "Invalid email");

    // Only block if real user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: args.email }
    });

    if (existingUser)
        throw new ApiError(400, "Account already exists. Please login.");

    // Generate OTP and hash it before saving to DB
    const otp = generateOTP();
    const hashedOtp = await hashPassword(otp);

    // Always replace old OTP
    await prisma.emailVerification.upsert({
        where: { email: args.email },
        update: {
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
        create: {
            email: args.email,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        }
    });

    await sendVerificationCode(args.email, otp);

    return { message: "OTP sent successfully" };
}

export async function logout(_: any, __: any, { user }: { user: UserType }) {
    if (!user) throw new ApiError(401, "Not authenticated");

    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh")?.value;

    if (refresh) {
        await prisma.refreshToken.deleteMany({
            where: { token: refresh }
        });
    }

    cookieStore.delete("access");
    cookieStore.delete("refresh");

    return { success: true };

}