"use client";

import CommentCard from "@/src/components/cards/CommentCard";
import { CREATE_COMMENT, DELETE_COMMENT } from "@/src/lib/gql/mutations/mutations";
import { GET_PIN_COMMENTS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { CommentType } from "@/src/types/types";
import { getGraphQLError } from "@/src/helper/ApiError";
import { Send } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";

const LIMIT = 5;

export default function CommentArea({ pinId }: { pinId: string }) {
    const { currentUser } = useContext(UserContext);

    const [comments, setComments] = useState<CommentType[]>([]);
    const [page, setPage] = useState(1);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [postComment, setPostComment] = useState("");

    const alreadyCommented = comments.some(
        c => c.user?.id === currentUser?.id
    );

    async function loadComments(p: number) {
        if (loading) return;

        try {
            setLoading(true);
            setError("");

            const res = await gqlClient.request(GET_PIN_COMMENTS_QUERY, {
                pinId,
                page: p,
            });

            const data = res.getPinComments;

            if (data.length === 0 && p === 1) {
                setComments([]);
                setShowComments(true);
                return;
            }

            setComments(data);
            setPage(p);
            setShowComments(true);
        } catch (e) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            setLoading(true);
            setError("");

            const res = await gqlClient.request(DELETE_COMMENT, {
                commentId: id,
            });

            if (!res.deleteComment.success) throw Error("Delete failed");

            setComments(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleCommentSend(e: React.FormEvent) {
        e.preventDefault();

        if (!postComment.trim()) return;
        if (postComment.length > 30) {

            setError("Comment should not be this long")
            return
        }

        try {
            setLoading(true);
            setError("");

            const res = await gqlClient.request(CREATE_COMMENT, {
                pinId,
                content: postComment,
            });

            setComments(prev => [res.sendComment, ...prev]);
            setPostComment("");
            setShowComments(true);
        } catch (e) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }
    console.log(alreadyCommented);

    return (
        <div className="mt-6 w-full max-w-2xl mx-auto px-2 sm:px-0">



            {!showComments && (
                <button
                    onClick={() => loadComments(1)}
                    className="text-sm border-b border-transparent hover:border-black transition-all"
                >
                    See comments
                </button>
            )}

            {showComments && (
                <div>
                    <form
                        onSubmit={handleCommentSend}
                        className="flex gap-3 mb-5"
                    >
                        <div className="flex-1 flex items-center bg-orange-200 rounded-2xl px-2 sm:px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-black transition-all">

                            <div className="flex items-center justify-center text-gray-600 pr-2">
                                <Send />
                            </div>

                            <input
                                value={postComment}
                                disabled={alreadyCommented}
                                onChange={e => setPostComment(e.target.value)}
                                placeholder={alreadyCommented ? "You already commented on this pin" : "Write a comment..."}
                                maxLength={30}
                                className={`w-full bg-transparent outline-none text-sm sm:text-base placeholder:text-gray-500 ${alreadyCommented ? "cursor-not-allowed opacity-70" : ""}`}
                            />
                        </div>

                        <button
                            title="comment"
                            type="submit"
                            disabled={alreadyCommented || loading}
                            className="btn-rect flex items-center justify-center! px-3 py-1 transition-all disabled:opacity-50! disabled:cursor-not-allowed!"
                        >
                            <Send />
                        </button>
                    </form>

                    <div className="mt-4">

                        {comments.length === 0 && (
                            <p className="text-sm text-gray-500">No comments yet</p>
                        )}

                        <div className="space-y-4 mt-3">
                            {comments.map(c => (
                                <CommentCard
                                    key={c.id}
                                    commentData={c}
                                    handleDelete={handleDelete}
                                    loading={loading}
                                    currentUserId={currentUser?.id}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mt-3 wrap-break-word">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
                            <button
                                disabled={page === 1 || loading}
                                onClick={() => loadComments(page - 1)}
                                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>

                            <button
                                disabled={comments.length < LIMIT || loading}
                                onClick={() => loadComments(page + 1)}
                                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
