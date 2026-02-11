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

}


export async function getSearchPagePins(_: any, { search, limit = 10, page = 1 }: any) {
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

}