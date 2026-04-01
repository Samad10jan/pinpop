"use client";

import { TOGGLE_FOLLOW } from "@/src/lib/gql/mutations/mutations";
import gqlClient from "@/src/lib/services/graphql";
import { getGraphQLError } from "@/src/helper/ApiError";
import { UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/src/components/commons/Toast";

export default function FollowBtn({ targetUserId, initiallyFollowing = false, onFollowChange }: { targetUserId: string; initiallyFollowing?: boolean; onFollowChange?: (v: boolean) => void }) {
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
    const toast = useToast();

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
        }
        catch (e: any) {
            const msg = getGraphQLError(e);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            title="follow"
            onClick={handleFollow}
            disabled={loading}
            className={`btn-rect md:px-5! md:py-2! px-2! py-1! rounded-xl! transition! text-sm!
        ${isFollowing ? "bg-black! text-white!" : "bg-white! text-black! border-black!"}
      `}
        >
            {
                isFollowing ? <UserMinus /> : <UserPlus />
            }
        </button>
    );
}
