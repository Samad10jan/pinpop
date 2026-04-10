import { ApiError } from "@/src/helper/ApiError";
import { buildFeedResponse } from "@/src/helper/pagination";
import prisma from "@/src/lib/services/prisma";
import { UserType } from "@/src/types/types";
import { uploadLimit } from "../../constants";

// Queries
export async function getSavedPins(
    _: any,
    { limit = 20, page = 1 }: { limit?: number; page?: number },
    { user }: { user: UserType }
) {
    try {
        if (!user) {
            return buildFeedResponse([], 0, page, limit);
        }

        const skip = (page - 1) * limit;

        const totalPins = await prisma.save.count({
            where: { userId: user.id },
        });

        const saves = await prisma.save.findMany({
            where: { userId: user.id },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },

            include: {
                pin: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                        likes: {
                            where: { userId: user.id },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        const mappedPins = saves.map((s) => ({
            ...s.pin,
            isLiked: s.pin.likes.length > 0,
            isSaved: true,
        }));

        return buildFeedResponse(mappedPins, totalPins, page, limit);
    } catch (error) {
        console.error(error);
        return buildFeedResponse([], 0, page, limit);
    }
}

export const getAllTags = async (_: any, __: any, { user }: { user: UserType }) => {
    const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" }
    })
    if (!user) throw new ApiError(401, "Unauthorized");

    const uploadCount = await prisma.pin.count({
        where: { userId: user.id },
        
    });
    return {
        tags: tags.map(t => ({ id: t.id, name: t.name })),
        uploadCount: uploadCount && uploadCount > uploadLimit ? false : true
    }

}

// Mutations Toggles

// Save and Like and Follow
export async function toggleSave(_: any, { pinId }: any, { user }: { user: UserType }) {
    if (!user) throw new ApiError(401, "Unauthorized");
    if (!pinId) throw new ApiError(400, "Pin ID is required");

    const existingSave = await prisma.save.findUnique({
        where: {
            userId_pinId: {
                userId: user.id,
                pinId,
            },
        },
    });

    // If saved
    if (existingSave) {
        await prisma.save.delete({
            where: {
                userId_pinId: {
                    userId: user.id,
                    pinId,
                },
            },
        });

        return {
            saved: false,
        };
    }

    // if not saved
    await prisma.save.create({
        data: {
            pinId,
            userId: user.id,
        },
    });

    return {
        saved: true,
    };
}

export async function toggleLike(_: any, { pinId }: any, { user }: { user: UserType }) {
    if (!user) throw new ApiError(401, "Unauthorized");
    if (!pinId) throw new ApiError(400, "Pin ID is required");

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_pinId: {
                userId: user.id,
                pinId,
            },
        },
    });

    // If liked
    if (existingLike) {
        await prisma.like.delete({
            where: {
                userId_pinId: {
                    userId: user.id,
                    pinId,
                },
            },
        });

        return {
            like: false,
        };
    }

    // if not liked
    await prisma.like.create({
        data: {
            pinId,
            userId: user.id,
        },
    });

    return {
        like: true,
    };
}

export async function toggleFollow(_: any, { targetUserId }: any, { user }: { user: UserType }) {

    if (!user) throw new ApiError(401, "Unauthorized");

    if (user.id === targetUserId) throw new ApiError(400, "You cannot follow yourself");

    const where = {
        // unique constraint on follow table to prevent duplicate follows
        followerId_followingId: {
            followerId: user.id,
            followingId: targetUserId,
        },
    };

    const existing = await prisma.follow.findUnique({ where });

    if (existing) {
        await prisma.follow.delete({ where });
        return { success: true };
    }

    await prisma.follow.create({
        data: {
            followerId: user.id,
            followingId: targetUserId,
        },
    });

    return { success: true };
};