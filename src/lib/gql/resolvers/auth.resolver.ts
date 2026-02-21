import prisma from "@/src/lib/services/prisma";
import { hashPassword, verifyPassword, signAccess, signRefresh } from "@/src/helper/auth";
import { cookies } from "next/headers";
import { ApiError } from "@/src/helper/ApiError";
import { generateOTP, sendVerificationCode } from "@/src/helper/email";

// // Mutations
// export async function signup(_: any, args: any) {

//     return await prisma.$transaction(async (tn) => {

//         if (!args.name || !args.email || !args.password)
//             throw new ApiError(400, "All fields required");

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(args.email))
//             throw new ApiError(400, "Invalid email format");

//         if (args.password.length < 8)
//             throw new ApiError(400, "Password must be at least 8 characters");

//         const exists = await tn.user.findUnique({
//             where: { email: args.email }
//         });

//         if (exists) throw new ApiError(400, "Email already exists");

//         const hashed = await hashPassword(args.password);

//         const user = await tn.user.create({
//             data: {
//                 name: args.name,
//                 email: args.email,
//                 passwordHash: hashed,
//                 avatar: args.avatar
//             }
//         });

//         const access = signAccess(user.id);
//         const refresh = signRefresh(user.id);

//         await tn.user.update({
//             where: { id: user.id },
//             data: { refreshToken: refresh }
//         });

//         const cookieStore = await cookies();

//         cookieStore.set("access", access, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "lax",
//             maxAge: 60 * 20, // longer than JWT
//         });

//         cookieStore.set("refresh", refresh, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "lax",
//             maxAge: 60 * 60 * 24 * 7, // 7 days
//         });



//         return {
//             user: {

//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 avatar: user.avatar,
//                 uploadCount: user.uploadCount,
//                 createdAt: user.createdAt,

//             }
//         };
//     });
// }
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
    if (record.otp !== args.otp)
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
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refresh }
    });

    //  Set cookies
    const cookieStore = await cookies();

    cookieStore.set("access", access, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 20,
    });

    cookieStore.set("refresh", refresh, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    });

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

        const user = await tn.user.findUnique({

            where: { email: args.email }
        });

        if (!user) throw new ApiError(400, "Invalid credentials");

        const ok = await verifyPassword(args.password, user.passwordHash);
        if (!ok) throw new ApiError(400, "Invalid credentials");

        const access = signAccess(user.id);
        const refresh = signRefresh(user.id);

        await tn.user.update({
            where: { id: user.id },
            data: { refreshToken: refresh }
        });

        const cookieStore = await cookies();

        cookieStore.set("access", access, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 20, // longer than JWT
        });

        cookieStore.set("refresh", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });




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



export async function sendSignupOtp(_: any, args: any) {

    if (!args.email)
        throw new ApiError(400, "Email required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email))
        throw new ApiError(400, "Invalid email");

    // ❗ Only block if real user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: args.email }
    });

    if (existingUser)
        throw new ApiError(400, "Account already exists. Please login.");

    const otp = generateOTP();

    // Always replace old OTP
    await prisma.emailVerification.upsert({
        where: { email: args.email },
        update: {
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
        create: {
            email: args.email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        }
    });

    await sendVerificationCode(args.email, otp);

    return { message: "OTP sent successfully" };
}

