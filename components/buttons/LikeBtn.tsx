"use client";

import { useState } from "react";
import gqlClient from "@/lib/services/graphql";

const TOGGLE_LIKE = `
mutation ($pinId: ID!) {
  toggleLike(pinId: $pinId) {
    like
  }
}
`;

export default function LikeBtn({
    pinId,
    isLiked: initialLiked,
}: {
    pinId: string;
    isLiked: boolean;
}) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        if (loading) return;

        try {
            setLoading(true);

            // Optimistic UI
            setIsLiked(prev => !prev);

            const res = await gqlClient.request(TOGGLE_LIKE, { pinId });


            setIsLiked(res.toggleLike.like);
        } catch (e) {
            console.error(e);

            // Rollback 
            setIsLiked(prev => !prev);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            onClick={handleToggle}
            className={`btn-rect px-6! py-3! rounded-full! text-sm! font-semibold!
        ${isLiked ? "bg-black! text-white!" : "bg-red-600! text-white!"}
        disabled:opacity-50`}
        >
            {isLiked ? "Unlike" : "Like"}
        </button>
    );
}
