"use client";

import CommentCard from "@/src/components/cards/CommentCard";
import { getGraphQLError } from "@/src/helper/ApiError";
import { CREATE_COMMENT, DELETE_COMMENT } from "@/src/lib/gql/mutations/mutations";
import { GET_PIN_COMMENTS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { CommentType } from "@/src/types/types";
import { Send } from "lucide-react";
import { use, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useToast } from "./Toast";

// const LIMIT = 5;

export default function CommentArea({
    pinId,
    showComments,
    setShowComments
}: {
    pinId: string;
    showComments: boolean;
    setShowComments: (v: boolean) => void;
}) {

    const context = useContext(UserContext);
    const currentUser = context?.currentUser;
    const toast = useToast();

    const [comments, setComments] = useState<CommentType[]>([]);
    const [page, setPage] = useState(1);
    // const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [postComment, setPostComment] = useState("");
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

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

            const data = res.getPinComments?.comments || [];
            // console.log("data", res);

            setHasNextPage(res.getPinComments.hasNextPage);
            setHasPrevPage(res.getPinComments.hasPrevPage);
            if (data.length === 0 && p === 1) {
                setComments([]);
                // if (!showComments) setShowComments(true);

                return;
            }

            setComments(data);
            setPage(p);
            // if (!showComments) setShowComments(true);
        } catch (e) {
            const message = getGraphQLError(e);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }
    // console.log(comments);


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
            const message = getGraphQLError(e);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleCommentSend(e: React.FormEvent) {
        e.preventDefault();

        if (!postComment.trim()) return;
        if (postComment.length > 30) {
            toast.error("Comment should not be this long");
            return;
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
            // setShowComments(true);
        } catch (e) {
            const message = getGraphQLError(e);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }
    // console.log(alreadyCommented);

    useEffect(() => {
        if (showComments) {
            loadComments(1);
        }
    }, [showComments]);

    return (
        <div className="mt-6 w-full max-w-2xl mx-auto px-2 sm:px-0">

            {showComments && (
                <div>
                    <form
                        onSubmit={handleCommentSend}
                        className="flex gap-3 mb-5"
                    >
                        <div className="flex-1 flex items-center bg-orange-200 rounded-2xl px-2 sm:px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-600 transition-all">

                            <div className="md:flex hidden size-10!  items-center justify-center text-gray-600 pr-2">
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
                            className="btn-rect size-11! md:size-13! flex items-center justify-center! px-3! py-1! transition-all disabled:opacity-50! disabled:cursor-not-allowed!"
                        >
                            <Send />
                        </button>
                    </form>

                    <div className="mt-4 ">

                        {comments.length === 0 && (
                            <p className="text-sm text-gray-500 text-center">No comments yet</p>
                        )}
                        {comments.length > 0 && (
                            <p className="text-sm text-gray-500 font-bold ">Comments</p>
                        )}

                        <div className="space-y-4 mt-3">
                            {comments.map(c => (
                                <CommentCard
                                    key={c.id}
                                    commentData={c}
                                    handleDelete={handleDelete}
                                    loading={loading}
                                    currentUserId={currentUser?.id as string}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mt-3 wrap-break-word">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
                            {hasPrevPage && <button
                                disabled={page === 1 || loading}
                                onClick={() => loadComments(page - 1)}
                                className="w-full sm:w-auto  rounded-xl border border-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>}
                            {hasNextPage &&
                                <button
                                    disabled={!hasNextPage || loading}
                                    onClick={() => loadComments(page + 1)}
                                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
