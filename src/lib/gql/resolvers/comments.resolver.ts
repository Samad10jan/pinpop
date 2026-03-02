import prisma from "@/src/lib/services/prisma";
import { UserType } from "@/src/types/types";
import { ApiError } from "@/src/helper/ApiError";

// Queries
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

// Mutations
export async function sendComment(_: any, { pinId, content }: any, { user }: { user: UserType }) {
    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!pinId) throw new ApiError(400, "Pin ID is required");
        if (!content.trim()) throw new ApiError(400, "Comment content cannot be empty");
        if (content.length > 30) throw new ApiError(400, "Comment content cannot be more than 30 characters");
       
       // Check if user already commented on this pin, Implemented one user one comment per pin
        const existing = await prisma.comment.findUnique({
            where: {
                userId_pinId: {
                    userId: user.id,
                    pinId,
                },
            },
        });

        if (existing) {
            throw new ApiError(400, "You can only comment once per pin");
        }


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

        // if (!comment) throw new ApiError(500, "Failed to post comment");
        return comment;
    } catch (error) {
        throw new ApiError(500, "Failed to post comment");
    }
}


export async function deleteComment(_: any, { commentId }: any, { user }: { user: UserType }) {

    try {
        if (!user) throw new ApiError(401, "Unauthorized");
        if (!commentId) throw new ApiError(400, "Comment ID is required");

        // Check if comment exists and belongs to user
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) throw new ApiError(404, "Comment not found");

        if (existingComment.userId !== user.id) {

            throw new ApiError(403, "Forbidden: You can only delete your own comments");
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return { success: true };



    } catch (error: any) {
        throw new ApiError(500, "Failed to delete comment");


    }
}