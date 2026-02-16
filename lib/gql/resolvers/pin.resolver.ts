import { Prisma } from "@/generated/prisma/client";
import { FileType } from "@/generated/prisma/enums";
import prisma from "@/lib/services/prisma";
import { PinPageResponseType, UserType } from "@/types/types";
import { ApiError } from "@/utils/ApiError";
import { buildFeedResponse } from "@/utils/helper/pagination";
import { isFollowing } from "./user.resolver";

export const getAllTags = async (_: any, __: any, { user }: { user: UserType }) => {
    const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" }
    })
    if (!user) throw new ApiError(401, "Unauthorized");

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

export const createPin = async (_: any, { title, description, mediaUrl, fileType, tagIds }: { title: string, description: string, mediaUrl: string, fileType: FileType, tagIds: string[] }, { user }: { user: UserType }) => {

    if (!user) throw new ApiError(401, "Unauthorized");

    if (!title?.trim() || !mediaUrl?.trim() || !fileType || !tagIds?.length) {
        throw new ApiError(400, "Title, mediaUrl, fileType and tags are required");
    }



    const uploadCount = user.uploadCount + 1;

    if (uploadCount > 15) {
        throw new ApiError(403, "Upload limit reached. Please try again later.");
    }
    if (tagIds.length > 3) {
        throw new ApiError(403, "Only 3 tags Max Allowed");
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


export async function getUserFeed(_: any, { limit = 10, page = 1 }: any, { user }: { user: UserType }) {
    try {
        const userId = user?.id;
        const skip = (page - 1) * limit;

        if (!userId) {
            return buildFeedResponse([], 0, page, limit);
        }

        const likedPins = await prisma.like.findMany({
            where: { userId },
            include: {
                pin: {
                    select: { tagIds: true, id: true },
                },
            },
        });

        const likedTagIds = [...new Set(likedPins.flatMap(like => like.pin.tagIds))];

        const userPins = await prisma.pin.findMany({
            where: { userId },
            select: { id: true },
        });

        let whereClause: any = {};

        // exlucde user's own pins from feed
        const excludeIds = userPins.map(p => p.id);

        if (excludeIds.length > 0) {
            whereClause.id = { notIn: excludeIds };
        }


        //include pins with tags user has liked, if any
        if (likedTagIds.length > 0) {
            whereClause.tagIds = { hasSome: likedTagIds };
        }


        const totalPins = await prisma.pin.count({ where: whereClause });

        const pins = await prisma.pin.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
                saves: {
                    where: { userId },
                    select: { id: true },
                },
                _count: {
                    select: { likes: true, saves: true, comments: true },
                },
            },
        });

        const mappedPins = pins.map(p => ({
            ...p,
            isSaved: p.saves.length > 0,
        }));

        return buildFeedResponse(mappedPins, totalPins, page, limit);

    } catch (error) {
        console.error("Error fetching feed:", error);
        return buildFeedResponse([], 0, page, limit);
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




export async function getSearchPagePins(_: any, { search, limit = 10, page = 1 }: any, user: UserType) {
    try {
        if (!search.trim()) {
            return buildFeedResponse([], 0, page, limit);
        }
        const userId = user?.id;

        const skip = (page - 1) * limit;

        const whereClause: Prisma.PinWhereInput = {
            title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
            },
        };

        const totalPins = await prisma.pin.count({ where: whereClause });

        const pins = await prisma.pin.findMany({

            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },

            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
                saves: {
                    where: { userId },
                    select: { id: true },
                },
            },
        });
        const mappedPins = pins.map(p => ({
            ...p,
            isSaved: p.saves.length > 0,
        }));

        return buildFeedResponse(mappedPins, totalPins, page, limit);

    } catch (error) {
        throw error;
    }
}


export async function getPinPageResponse(_: any, { id }: { id: string }, { user }: { user: UserType }) {
    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!id) throw new ApiError(400, "Pin ID is required");

        // First get pin
        const pin = await prisma.pin.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        _count: {
                            select: { followers: true },
                        },
                    },
                },

                saves: {
                    where: { userId: user.id },
                    select: { id: true },
                },
                likes: {
                    where: { userId: user.id },
                    select: { id: true },
                },

                _count: {
                    select: {
                        likes: true,
                        saves: true,
                    },
                },
            },
        });

        if (!pin) throw new ApiError(404, "Pin not found");

        const tagIds = pin.tagIds.map(String);

        const relatedPins = await prisma.pin.findMany({
            where: {
                tagIds: { hasSome: tagIds },
                id: { not: pin.id },
                userId: { not: user.id },
            },

            include: {
                saves: {
                    where: { userId: user.id },
                    select: { id: true },
                },
            },

            take: 10,
            orderBy: { createdAt: "desc" },
        })

        // console.log("aa",pin.user.id);



        const follow = await prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: pin.user.id,
            },
        });

        const isFollowing = !!follow;



        return {
            pin: {
                ...pin,
                isSaved: pin.saves.length > 0,
                isLiked: pin.likes.length > 0,
            },

            likesCount: pin._count.likes,
            savesCount: pin._count.saves,
            followersCount: pin.user._count.followers ?? 0,
            isFollowing,

            relatedPins: relatedPins.map(p => ({
                ...p,
                isSaved: p.saves.length > 0,
            })),
        };
    } catch (error) {
        throw error;
    }
}

export async function getTagsForPin(parent: PinPageResponseType,) {
    const tagIds = parent.pin.tagIds
    const tags = await prisma.tag.findMany({
        where: {
            id: { in: tagIds },
        }
    })
    console.log(tags);

    return tags
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

export async function sendComment(_: any, { pinId, content }: any, { user }: { user: UserType }) {
    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!pinId) throw new ApiError(400, "Pin ID is required");
        if (!content.trim()) throw new ApiError(400, "Comment content cannot be empty");
        if (content.legth > 30) throw new ApiError(400, "Comment content cannot be more than 30 characters");


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

// delete comment
export async function deleteComment(_: any, { commentId }: any, { user }: { user: UserType }) {

    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!commentId) throw new ApiError(400, "Comment ID is required");

        // Check if comment exists and belongs to user
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment) throw new ApiError(404, "Comment not found");
        if (existingComment.userId !== user.id) throw new ApiError(403, "Forbidden: You can only delete your own comments");

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return { success: true };



    } catch (error: any) {
        throw new ApiError(500, "Failed to delete comment");


    }
}

// Save and Like and Follow
export async function getSavedPins(_: any, __: any, { user }: { user: UserType }) {
    if (!user) return [];

    const saves = await prisma.save.findMany({
        where: { userId: user.id },
        include: {
            pin: {
                include: {
                    user: true,
                    _count: {
                        select: { likes: true, saves: true }
                    }
                }
            }
        }
    });

    return saves.map(s => ({
        ...s.pin,
        likesCount: s.pin._count.likes,
        savesCount: s.pin._count.saves,
        isSaved: true
    }));
}


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

