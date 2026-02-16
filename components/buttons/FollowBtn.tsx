"use client";

import { TOGGLE_FOLLOW } from "@/lib/gql/mutations/mutations";
import gqlClient from "@/lib/services/graphql";
import { useEffect, useState } from "react";

export default function FollowBtn({ targetUserId, initiallyFollowing = false, onFollowChange }: { targetUserId: string; initiallyFollowing?: boolean; onFollowChange?: (v: boolean) => void }) {
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initiallyFollowing);

    // sync if parent changes
    useEffect(() => {
        setIsFollowing(initiallyFollowing);
    }, [initiallyFollowing]);

    async function handleFollow() {

        if (loading) return;

        try {
            setLoading(true);

            const res = await gqlClient.request(TOGGLE_FOLLOW, {
                targetUserId,
            });

            if (res?.toggleFollow?.success) {
                const newState = !isFollowing;

                setIsFollowing(newState);
                onFollowChange?.(newState);
            }
        } catch (e: any) {
            console.error(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`btn-rect border px-5 py-2 rounded-xl transition
        ${isFollowing ? "bg-black! text-white!" : "bg-white! text-black! border-black!"}
      `}
        >
            {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
}
