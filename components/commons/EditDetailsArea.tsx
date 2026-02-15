"use client";

import { UPDATE_PROFILE } from "@/lib/gql/mutations/mutations";
import gqlClient from "@/lib/services/graphql";
import { UserType } from "@/types/types";
import { getGraphQLError } from "@/utils/ApiError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function EditDetailsArea({ userData, onClose }: { userData: UserType; onClose: () => void }) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (userData) {
            setName(userData.name || "");
        }
    }, [userData]);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            if (!name.trim()) throw new Error("Name required");

            let avatarUrl = null;

            if (avatar) {
                const form = new FormData();
                form.append("file", avatar);
                //  e.target.files?.[0]

                const upload = await fetch("/api/upload/avatar", {
                    method: "POST",
                    body: form,
                });
                
                if (!upload.url) throw new Error("Image upload failed. Please try again.");

                // const fileType = file.type.includes("gif") ? "GIF" : "PHOTO";
                const uploaded = await upload.json();
                avatarUrl = uploaded?.url || null;
            }

            await gqlClient.request(UPDATE_PROFILE, {
                name,
                avatar: avatarUrl,
            });

            onClose();
            location.reload();
        } catch (e: any) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }
    // createPortal used to avoid any mixing with elements on body
    return createPortal(
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-9999"
            onClick={onClose}
        >
            {/* Stop bubbling so modal doesn't close when clicking inside, if clicked here without stoping event delegation it will send event to upper parent that will think as event occured on me so onClick will be triggerd */}
            <div
                className="card relative w-[90vw] max-w-md p-6 bg-white"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 btn-circle bg-red-500 text-white"
                >
                    ✕
                </button>

                <h1 className="text-2xl font-bold mb-4 text-center">
                    Edit Profile
                </h1>

                {error && (
                    <p className="text-red-500 mb-3 text-sm text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
                    <input
                        placeholder="Name"
                        className="card outline-0"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="file"
                        title="avatar"
                        className="btn-rect"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    />

                    <button disabled={loading} className="btn-rect mt-2">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
