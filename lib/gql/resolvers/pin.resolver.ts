import prisma from "@/lib/services/prisma";
import { ApiError } from "@/utils/ApiError";

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

