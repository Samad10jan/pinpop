"use client";

import { useState } from "react";
import gqlClient from "@/lib/services/graphql";
import {
    GET_PIN_COMMENTS_QUERY,
} from "@/lib/gql/queries/queries";
import { getGraphQLError } from "@/utils/ApiError";
import CommentCard from "@/components/cards/CommentCard";
import { CommentType } from "@/types/types";
import { CREATE_COMMENT } from "@/lib/gql/mutations/mutations";

const LIMIT = 5;

export default function CommentArea({ pinId }: { pinId: string }) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [page, setPage] = useState(1);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [postComment, setPostComment] = useState("");

    async function loadComments(p: number) {
        try {
            setLoading(true);

            const res = await gqlClient.request(GET_PIN_COMMENTS_QUERY, {
                pinId,
                page: p,
            });

            if (res.getPinComments.length === 0) {
                setError("No comments yet");
                return;
            }

            setComments(res.getPinComments);
            setPage(p);
            setShowComments(true);
        } catch (e) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleCommentSend(e: React.FormEvent) {
        e.preventDefault();

        if (!postComment.trim()) return;

        try {
            setLoading(true);

            const res = await gqlClient.request(CREATE_COMMENT, {
                pinId,
                content: postComment,
            });

            // Optimistic UI: add new comment on top
            setComments((prev) => [res.sendComment, ...prev]);

            setPostComment("");
            setShowComments(true);
        } catch (e) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-6">


            <form onSubmit={handleCommentSend} className="flex gap-2 mb-4">
                <input
                    value={postComment}
                    onChange={(e) => setPostComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border rounded-xl px-4 py-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-rect relative overflow-hidden bg-white! group text-black! border-black! border! disabled:opacity-50! disabled:cursor-not-allowed!"
                >
                    Send

                    <div className="absolute inset-0 w-2 h-full  bg-orange-400 blur-xs transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-1500"  />
                </button>

            </form>

            {!showComments && (
                <button
                    onClick={() => loadComments(1)}
                    className="text-sm underline"
                >
                    See more comments
                </button>
            )}

            {showComments && (
                <>
                    <div className="space-y-3 mt-4">
                        {comments.map((c: CommentType) => (
                            <CommentCard key={c.id} commentData={c} />
                        ))}
                    </div>
                    {error && <p className="text-red-500 mx-auto">{error}</p>}
                    <div className="flex justify-between mt-4">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => loadComments(page - 1)}
                            className="px-4! py-1! btn-rect bg-green-400! border rounded disabled:opacity-50 disabled:cursor-not-allowed!"
                        >
                            Prev
                        </button>

                        <button
                            disabled={comments.length < LIMIT || loading}
                            onClick={() => loadComments(page + 1)}
                            className="px-4! btn-rect py-1! disabled:cursor-not-allowed! bg-green-400! border rounded disabled:opacity-50 "
                        >
                            Next
                        </button>
                    </div>
                </>
            )}


        </div>
    );
}
