import { FileType } from "@/generated/prisma/enums";
import prisma from "@/lib/services/prisma";
import { PinPageResponseType, UserType } from "@/types/types";
import { ApiError } from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";

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
    if(tagIds.length>3){
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


//

export async function getUserFeed(_: any, { limit = 10, page = 1 }: any, { user }: { user: UserType }) {
    try {
        const userId = user?.id;
        const skip = (page - 1) * limit;


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



        // Get IDs of pins user already liked (to exclude)
        // const likedPinIds = likedPins.map(like => like.pin.id);

        // Get user's own pins (to exclude)
        const userPins = await prisma.pin.findMany({
            where: { userId },
            select: { id: true },
        });
        const userPinIds = userPins.map(p => p.id);



        const excludeIds = [...userPinIds];



        // If user has liked pins with tags, get pins with those tags
        if (likedTagIds.length > 0) {

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
                    saves: {
                        where: { userId },
                        select: { id: true }
                    },
                    _count: {
                        select: { likes: true, saves: true, comments: true },
                    },
                },
            });


            return pins.map(p => ({
                ...p,
                isSaved: p.saves.length > 0
            }));
        };

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
                createdAt: "desc"
            },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
                saves: {
                    where: { userId },
                    select: { id: true }
                },

            },
        });

        return pins.map(p => ({
            ...p,
            isSaved: p.saves.length > 0
        }));

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




        return {
            pin: {
                ...pin,
                isSaved: pin.saves.length > 0,
                isLiked: pin.likes.length > 0,
            },

            likesCount: pin._count.likes,
            savesCount: pin._count.saves,
            followersCount: pin.user._count.followers ?? 0,

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


// Save and Like
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