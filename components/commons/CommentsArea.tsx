"use client";

import CommentCard from "@/components/cards/CommentCard";
import { CREATE_COMMENT, DELETE_COMMENT } from "@/lib/gql/mutations/mutations";
import { GET_PIN_COMMENTS_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { CommentType } from "@/types/types";
import { getGraphQLError } from "@/utils/ApiError";
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

    return (
        <div className="mt-6">

            <form onSubmit={handleCommentSend} className="flex gap-2 mb-4">
                <div className="flex-1 ring rounded-xl pr-2 py-1 flex bg-orange-300">
                    <div className=" flex justify-center items-center rounded-2xl px-3">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>

                    </div>

                    <input
                        value={postComment}
                        disabled={alreadyCommented}
                        onChange={e => setPostComment(e.target.value)}
                        placeholder={alreadyCommented ? "You already commented on this pin" : "Write a comment..."}
                        className={`flex-1 ring rounded-xl bg-white px-4 py-2 ${alreadyCommented ? "cursor-not-allowed" : ""}`}
                        maxLength={30}
                    />
                </div>

                <button
                    title="comment"
                    type="submit"
                    disabled={loading || alreadyCommented}
                    className={`btn-rect bg-white! border-black! border disabled:opacity-50 ${alreadyCommented ? "cursor-not-allowed!" : ""}`}
                >
                    <Send/>
                </button>
            </form>

            {!showComments && (
                <button
                    onClick={() => loadComments(1)}
                    className="text-sm border-b hover:scale-105 transition-all"
                >
                    See comments
                </button>
            )}

            {showComments && (
                <>
                    {comments.length === 0 && (
                        <p className="text-sm text-gray-500">No comments yet</p>
                    )}

                    <div className="space-y-3 mt-4">
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

                    {error && <p className="text-red-500 mt-2 truncate">{error}</p>}

                    <div className="flex justify-between mt-4">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => loadComments(page - 1)}
                            className="btn-rect px-4 py-1 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <button
                            disabled={comments.length < LIMIT || loading}
                            onClick={() => loadComments(page + 1)}
                            className="btn-rect px-4 py-1 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
