import prisma from "@/lib/services/prisma";
import { ApiError } from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";

export const getTags = async (_: any, __: any, { user }: any) => {
    const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" }
    })
    const uploadCount = await prisma.user.findUnique({
        where: { id: user.id },
        select: { uploadCount: true }
    });
    return {
        tags: tags.map(t => ({ id: t.id, name: t.name })),
        uploadCount: uploadCount?.uploadCount && uploadCount?.uploadCount > 15 ? false : true
    }
    // || 0

}

export const createPin = async (_: any, { title, description, mediaUrl, fileType, tagIds }: any, { user }: any) => {

    if (!user) throw new ApiError(401, "Unauthorized");

    if (!title?.trim() || !mediaUrl?.trim() || !fileType || !tagIds?.length) {
        throw new ApiError(400, "Title, mediaUrl, fileType and tags are required");
    }



    const uploadCount = user.uploadCount + 1;
    if (uploadCount > 15) {
        throw new ApiError(403, "Upload limit reached. Please try again later.");
    }

    const pin = await prisma.pin.create({
        data: {
            title,
            description,
            mediaUrl,
            fileType,
            tagIds,

            userId: user.id
        }
    });

    if (!pin) throw new ApiError(500, "Failed to create pin");

    await prisma.user.update({
        where: { id: user.id },
        data: {
            uploadCount: {
                increment: 1
            }
        }
    });

    return pin;
};


//

export async function getUserFeed(_: any, { limit = 10, page = 1 }: any, { user }: any) {
    try {
        const userId = user?.id;
        const skip = (page - 1) * limit;

        // console.log("userId:", userId);

        // New user or guest - return null
        if (!userId) {
            return [];
        }

        // Get all tagIds from user's liked pins
        const likedPins = await prisma.like.findMany({
            where: { userId },
            include: {
                pin: {
                    select: { tagIds: true, id: true },
                },
            },
        });

        console.log("likedPins count:", likedPins.length);

        // Extract unique tag IDs
        const likedTagIds = [...new Set(likedPins.flatMap(like => like.pin.tagIds))];

        // console.log("likedTagIds:", likedTagIds);

        // Get IDs of pins user already liked (to exclude)
        const likedPinIds = likedPins.map(like => like.pin.id);

        // Get user's own pins (to exclude)
        const userPins = await prisma.pin.findMany({
            where: { userId },
            select: { id: true },
        });
        const userPinIds = userPins.map(p => p.id);

        // console.log("userPinIds:", userPinIds);

        // Combine all pins to exclude
        const excludeIds = [...likedPinIds, ...userPinIds];

        // console.log("excludeIds:", excludeIds);

        // If user has liked pins with tags, get pins with those tags
        if (likedTagIds.length > 0) {
            // console.log("Fetching pins with matching tags");

            const whereClause: any = {
                tagIds: { hasSome: likedTagIds }
            };

            // Only add notIn if there are IDs to exclude
            if (excludeIds.length > 0) {
                whereClause.id = { notIn: excludeIds };
            }

            const pins = await prisma.pin.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { likes: { _count: 'desc' } },
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true },
                    },
                    _count: {
                        select: { likes: true, saves: true, comments: true },
                    },
                },
            });

            // console.log("Pins with tags found:", pins.length);
            return pins;
        }

        // console.log("No liked tags, fetching popular pins");

        // User hasn't liked anything - return popular pins (excluding own)
        const whereClause: any = {};

        // Only add notIn if there are user pins to exclude
        if (userPinIds.length > 0) {
            whereClause.id = { notIn: userPinIds };
        }

        const pins = await prisma.pin.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"   // ✅ Mongo supported
            },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                }
            },
        });


        // Add this temporarily at the start of your function
        const totalPins = await prisma.pin.count();
        // console.log("Total pins in database:", totalPins);
        // console.log("Popular pins found:", pins.length);
        return pins;

    } catch (error) {
        console.error("Error fetching feed:", error);
        return [];
    }
}

export async function getSugg(_: any, { search }: any) {
    try {
        if (!search.trim()) {
            return [];
        }
        const pins = await prisma.pin.findMany({
            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            take: 5
        });

        return pins.map(p => p.title)
    } catch (error) {
        throw error;
    }
}


export async function getSearchPagePins(_: any, { search, limit = 10, page = 1 }: any) {
    try {
        if (!search.trim()) {
            return [];
        }
        const skip = (page - 1) * limit;
        const pins = await prisma.pin.findMany({
            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }

        });

        return pins
    } catch (error) {
        throw error;
    }
}

export async function getPinResponse(_: any, { id }: any, { user }: any) {
    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!id) throw new ApiError(400, "Pin ID is required");

        const pin = await prisma.pin.findUnique({
            where: { id },

            include: {
                user: {
                    include: {
                        _count: {
                            select: {
                                followers: true,
                            },
                        },
                    },
                },
                // comments: {
                //     orderBy: {
                //         createdAt: "desc",
                //     },
                //     include: {
                //         user: true,
                //     },
                // },

                _count: {
                    select: {
                        likes: true,
                        saves: true,
                    },
                },
            }
        });

        if (!pin) throw new ApiError(404, "Pin not found");

        const tagIds = pin.tagIds.map(String);

        const relatedPins = await prisma.pin.findMany({
            where: {
                tagIds: {
                    hasSome: tagIds,
                },

                // exclude current pin
                id: {
                    not: pin.id,
                },

                // exclude current logged in user pins
                userId: {
                    not: user.id,
                },
            },

            take: 10,

            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            pin: {
                ...pin,
                likesCount: pin._count.likes,
                savesCount: pin._count.saves,
            },
            followersCount: pin.user._count.followers ?? 0,
            relatedPins,
        };
    } catch (error) {
        throw error;
    }
}

// COMMENTS

export async function getPinComments(_: any, { pinId, page = 1 }: any) {
    try {
        if (!pinId) throw new ApiError(400, "Pin ID is required");

        const skip = (page - 1) * 5;

        const comments = await prisma.comment.findMany({
            where: { pinId },
            skip,
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
        if (!comments) throw new ApiError(404, "Comments not found");
        return comments;
    } catch (error) {
        throw error;
    }
}

export async function sendComment(_: any, { pinId, content }: any, { user }: any) {
    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!pinId) throw new ApiError(400, "Pin ID is required");
        if (!content.trim()) throw new ApiError(400, "Comment content cannot be empty");

        const comment = await prisma.comment.create({
            data: {
                content,
                pinId,
                userId: user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!comment) throw new ApiError(500, "Failed to post comment");
        return comment;
    } catch (error) {
        throw error;
    }
}
