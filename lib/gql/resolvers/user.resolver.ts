import prisma from "@/lib/services/prisma";
import { ApiError } from "@/utils/ApiError";

export const user = async (_: any, __: any, { user }: any) => user;

export const getProfile = async (_: any, __: any, { user }: any) => {

    if (!user) throw new ApiError(401, "Unauthorized");

    const savedPins = await prisma.save.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            pin: true
        }
    })

    // if(!savedPins) {
    //     return {
    //     user,
    //     savedPins: []


    // };
    // }
console.log("mera user:",user);

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