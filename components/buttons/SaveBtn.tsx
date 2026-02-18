"use client";

import { useState } from "react";
import gqlClient from "@/lib/services/graphql";
import { Heart } from "lucide-react";

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
            className="btn-circle relative overflow-hidden! group disabled:opacity-50"
            title={isSaved ? "saved " : "save"}
        >


            <Heart fill={isSaved ? "red" : "white"} size={25}className="boder-2"/>



            <div className="absolute inset-0 w-2 h-full  bg-amber-300 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />
        </button>
    );
}
