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
export const login = async (_: any, args: any) => {

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

// export async function addTags(_:any,){
//     const tagNames = [
//   "art",
//   "illustration",
//   "digital-art",
//   "sketch",
//   "painting",
//   "photography",
//   "aesthetic",
//   "minimal",
//   "abstract",
//   "vintage",

//   "fashion",
//   "streetwear",
//   "outfit",
//   "mens-style",
//   "womens-style",
//   "accessories",
//   "shoes",
//   "bags",

//   "fitness",
//   "workout",
//   "gym",
//   "yoga",
//   "bodybuilding",

//   "technology",
//   "programming",
//   "web-development",
//   "ui-design",
//   "ux-design",
//   "mobile-app",
//   "coding",
//   "startup",

//   "anime",
//   "manga",
//   "gaming",
//   "esports",
//   "pixel-art",

//   "architecture",
//   "interior",
//   "3d-design",
//   "product-design",

//   "quotes",
//   "motivation",
//   "productivity",
//   "mindset",

//   "cars",
//   "motorcycles",
//   "luxury",

//   "memes",
//   "funny",
//   "creative",

//   "tattoo",
//   "typography",
//   "branding",
//   "logo",

//   "pets",
//   "dogs",
//   "cats",

//   "makeup",
//   "hairstyle",
//   "skincare",

//   "music",
//   "guitar",
//   "piano",

//   "education",
//   "science",
//   "space",
//   "robotics",

//   "business",
//   "marketing",
//   "entrepreneur",

//   "craft",
//   "diy",

//   "wallpapers",
//   "backgrounds"
// ];

//     const createTags= await prisma.tag.createMany(
//         {
//             data: tagNames.map(name => ({ name }))
//         }
//     )

// }

