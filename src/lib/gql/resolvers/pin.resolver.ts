import { FileType } from "@/generated/prisma/enums";
import { ApiError } from "@/src/helper/ApiError";
import { buildFeedResponse } from "@/src/helper/pagination";
import prisma from "@/src/lib/services/prisma";
import { PinPageResponseType, UserType } from "@/src/types/types";


// Queries
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

                // !! get saves and likes by current user to determine if pin is saved/liked
                saves: {
                    where: { userId: user.id },
                    select: { id: true },
                },
                likes: {
                    where: { userId: user.id },
                    select: { id: true },
                },

                // get counts for likes and saves
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

            // get user and check if current user saved thepins
            include: {
                saves: {
                    where: { userId: user.id },
                    select: { id: true },
                },
                user: {
                    select: { id: true, name: true, avatar: true },
                },
            },

            take: 10,
            orderBy: {
                likes: {
                    _count: "desc",
                },
            },
        })

        // If no related pins, get top pins excluding current user's pins and current pin
        if (relatedPins.length === 0) {

            const fallbackPins = await prisma.pin.findMany({
                where: {
                    id: { not: pin.id },
                    userId: { not: user.id },
                },
                include: {
                    saves: {
                        where: { userId: user.id },
                        select: { id: true },
                    },
                    user: {
                        select: { id: true, name: true, avatar: true },
                    },
                },
                take: 10,
                orderBy: {
                    likes: {
                        _count: "desc",
                    },
                },
            });

            relatedPins.push(...fallbackPins);
        }

        // console.log("aa",pin.user.id);


        // Check if current user follows the pin's creator
        const follow = await prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: pin.user.id,
            },
        });

        // convert to boolean
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

        const excludeIds = userPins.map(p => p.id);

        if (excludeIds.length > 0) {
            whereClause.id = { notIn: excludeIds };
        }

        if (likedTagIds.length > 0) {
            whereClause.tagIds = { hasSome: likedTagIds };
        }

        const totalPins = await prisma.pin.count({ where: whereClause });

        let pins = await prisma.pin.findMany({
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

        // If less than limit, fill with top pins
        if (pins.length < limit) {

            const remaining = limit - pins.length;

            const alreadyFetchedIds = pins.map(p => p.id);

            const fallbackPins = await prisma.pin.findMany({
                where: {
                    id: {
                        notIn: [...excludeIds, ...alreadyFetchedIds],
                    },
                },
                take: remaining,
                orderBy: {
                    likes: {
                        _count: "desc",
                    },
                },
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

            pins = [...pins, ...fallbackPins];
        }

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

      

        const totalPins = await prisma.pin.count({
            where: {
                     OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive"
                }
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            ]
            }
        });


        const pins = await prisma.pin.findMany({

            where: {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
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


export async function getTagsForPin(parent: PinPageResponseType,) {
    const tagIds = parent.pin.tagIds
    const tags = await prisma.tag.findMany({
        where: {
            id: { in: tagIds },
        }
    })
    // console.log(tags);

    return tags
}


export async function getCurrentUserPins(_: any, __: any, { user }: { user: UserType }) {

    if (!user?.id) throw new Error("Unauthorized");

    const userId = user.id;

    // Fetch all pins with counts
    const pins = await prisma.pin.findMany({
        where: { userId },
        include: {
            _count: {
                select: {
                    likes: true,
                    saves: true,
                    comments: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    //  Format pins + engagement score
    const formattedPins = pins.map((pin) => {
        const likes = pin._count.likes;
        const saves = pin._count.saves;
        const comments = pin._count.comments;

        return {
            id: pin.id,
            title: pin.title,
            description: pin.description,
            mediaUrl: pin.mediaUrl,
            fileType: pin.fileType,
            tagIds: pin.tagIds,
            createdAt: pin.createdAt,

            likesCount: likes,
            savesCount: saves,
            commentsCount: comments,

            // Simple engagement formula
            engagementScore: likes * 1 + saves * 2 + comments * 3,
        };
    });

    // Totals
    const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({ where: { followingId: userId } }),
        prisma.follow.count({ where: { followerId: userId } }),
    ]);

    const totalLikes = formattedPins.reduce((a, b) => a + b.likesCount, 0);
    const totalSaves = formattedPins.reduce((a, b) => a + b.savesCount, 0);
    const totalComments = formattedPins.reduce((a, b) => a + b.commentsCount, 0);

    //  Top 5 pins by engagement
    const topPins = [...formattedPins]
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 5);

    //  Average engagement
    const avgEngagementPerPin =
        formattedPins.length > 0
            ? (
                formattedPins.reduce((a, b) => a + b.engagementScore, 0) /
                formattedPins.length
            ).toFixed(2)
            : 0;

    return {
        pins: formattedPins,

        totalPins: formattedPins.length,
        totalLikes,
        totalSaves,
        totalComments,

        followersCount,
        followingCount,

        avgEngagementPerPin: Number(avgEngagementPerPin),

        topPins,
    };
}

export async function getUserAllPins(_: any, { userId, limit = 10, page = 1 }: any, { user }: { user: UserType }) {
    try {
        const skip = (page - 1) * limit;

        const totalPins = await prisma.pin.count({
            where: { userId },
        });

        const pins = await prisma.pin.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
                saves: {
                    where: { userId: user?.id },
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
    } catch (error: any) {
        throw new ApiError(500, `Failed to fetch user's pins ${error?.message}`);
    }
}

export async function getPinsByTag(_: any, { tagId, limit = 10, page = 1 }: any, { user }: { user: UserType }) {
    try {
        
        if (!tagId) {
            return buildFeedResponse([], 0, page, limit);
        }
        const skip = (page - 1) * limit;

        const tag = await prisma.tag.findUnique({
            where: { id: tagId },
        });
        if (!tag) {
            return buildFeedResponse([], 0, page, limit);
        }
        const totalPins = await prisma.pin.count({
            where: {
                tagIds: { has: tagId },
            },
        });

        const pins = await prisma.pin.findMany({
            where: {
                tagIds: { has: tagId },
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
                saves: {
                    where: { userId: user?.id },
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
        
    }
}

// Mutations
export async function createPin(_: any, { title, description, mediaUrl, fileType, tagIds }: { title: string, description: string, mediaUrl: string, fileType: FileType, tagIds: string[] }, { user }: { user: UserType }) {

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

