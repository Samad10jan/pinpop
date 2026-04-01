"use client";

import { useState } from "react";
import gqlClient from "@/src/lib/services/graphql";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";

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
            className="btn-circle size-10! relative overflow-hidden! group bg-white! disabled:opacity-50"
               title={isLiked ? "liked " : "like"}>

             <ThumbsUp fill={isLiked ? "yellow" : "white"} size={25} />
            <div className="absolute inset-0 w-2 h-full  bg-amber-300 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />
        </button>
    );
}
