import prisma from "@/src/lib/services/prisma";
import { UserType } from "@/src/types/types";
import { ApiError } from "@/src/helper/ApiError";

// Queries

export const user = async (_: any, __: any, { user }: { user: UserType }) => {
    if (!user) return null;

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            uploadCount: user.uploadCount,
            createdAt: user.createdAt,
        },
    };
}

export const getCurrentProfile = async (_: any, __: any, { user }: { user: UserType }) => {

    if (!user) throw new ApiError(401, "Unauthorized");

    const savedPins = await prisma.save.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { pin: true }
    })

    // console.log("mera user:", user);

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            uploadCount: user.uploadCount,
            createdAt: user.createdAt
        },
        lastSavedPins: savedPins.map(s => s.pin),


    };
}

// helper resolvers
export const getFollwersCount = async (parent: any, _: any) => {
    const userId = parent.user.id;
    if (!userId) throw new ApiError(400, "User ID is required");
    return await prisma.follow.count({
        where: { followingId: userId }
    });
};

export const getFollowingCount = async (parent: any, _: any) => {
    const userId = parent.user.id;
    if (!userId) throw new ApiError(400, "User ID is required");
    return await prisma.follow.count({
        where: { followerId: userId }
    });
}

export const getTotalLikes = async (parent: any, _: any) => {
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

export const isFollowing = async (parent: any, _: any, { user }: { user: UserType }) => {

    if (!user) return false;
    // console.log("aaaa");
    

    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: user.id,
                followingId: parent.user.id,
            },
        },
    });

    return !!follow;
};

export const getProfile = async (_: any, { userId }: any) => {

    if (!userId) throw new ApiError(400, "User ID is required");

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    // console.log(user);

    if (!user) throw new ApiError(404, "User not found");

    const lastUploadedPins = await prisma.pin.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        // include: { pin: true }
    })


    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            uploadCount: user.uploadCount,
            createdAt: user.createdAt
        },
        lastUploadedPins,
    };


}

// Mutations

export const updateProfile = async (_: any, { name, avatar }: { name:string, avatar:string }, { user }: { user: UserType }) => {
   
    if (!user) throw new ApiError(401, "Unauthorized");

    if (!name && !avatar) throw new ApiError(400, "At least one field (name or avatar) is required");

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            name: name || user.name,
            avatar: avatar || user.avatar
        }
    });

    return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        uploadCount: updatedUser.uploadCount,
        createdAt: updatedUser.createdAt
    };
}
