import prisma from "@/lib/services/prisma";
import { ApiError } from "@/utils/ApiError";

export const user = async (_: any, __: any, { user }: any) => user;

export const getCurrentProfile = async (_: any, __: any, { user }: any) => {

    if (!user) throw new ApiError(401, "Unauthorized");

    const savedPins = await prisma.save.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { pin: true }
    })

    console.log("mera user:", user);

    return {
        user,
        lastSavedPins: savedPins.map(s => s.pin),


    };
}

export const getFollwersCount = async (parent: any, _: any, context: any) => {
    const userId = parent.user.id;
    return await prisma.follow.count({
        where: { followingId: userId }
    });
};

export const getFollowingCount = async (parent: any, _: any, context: any) => {
    const userId = parent.user.id;
    return await prisma.follow.count({
        where: { followerId: userId }
    });
}

export const getTotalLikes = async (parent: any, _: any, context: any) => {
    const userId = parent.user.id;

    // Count all likes ON pins Created by this user
    const likes = await prisma.like.count({
        where: {
            pin: {
                userId: userId
            }
        }
    });

    return likes;
}


export const getProfile = async (_: any, { userId }: any,) => {

    if (!userId) throw new ApiError(400, "User ID is required");

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user) throw new ApiError(404, "User not found");


    return {
        user
    };


}

// Follow & Save & Like