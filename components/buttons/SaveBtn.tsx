"use client";

import { useState } from "react";
import gqlClient from "@/lib/services/graphql";

const TOGGLE_SAVE = `
mutation ($pinId: ID!) {
  toggleSave(pinId: $pinId) {
    saved
  }
}
`;

export default function SaveBtn({
    pinId,
    isSaved: initialSaved,
}: {
    pinId: string;
    isSaved: boolean;
}) {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        if (loading) return;

        try {
            setLoading(true);

            // Optimistic UI
            setIsSaved(prev => !prev);

            const res = await gqlClient.request(TOGGLE_SAVE, { pinId });

            // Sync with backend truth
            setIsSaved(res.toggleSave.saved);
        } catch (e) {
            console.error(e);

            // Rollback optimistic update
            setIsSaved(initialSaved);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            onClick={handleToggle}
            className={`btn-rect px-6! py-3! rounded-full! text-sm! font-semibold!
        ${isSaved ? "bg-black! text-white!" : "bg-red-600! text-white!"}
        disabled:opacity-50`}
        >
            {isSaved ? "Unsave" : "Save"}
        </button>
    );
}
