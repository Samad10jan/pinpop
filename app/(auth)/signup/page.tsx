"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "graphql-request";
import { SIGN_UP } from "@/lib/gql/mutations/mutations";
import gqlClient from "@/lib/services/graphql";
import { getGraphQLError } from "@/utils/ApiError";

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            if (!email.includes("@")) throw new Error("Invalid email");
            if (password.length < 8) throw new Error("Password must be 8+ chars");
            if (!name.trim()) throw new Error("Name required");

            let avatarUrl = null;

            if (avatar) {
                const form = new FormData();
                form.append("file", avatar);

                const upload = await fetch("/api/upload/avatar", {
                    method: "POST",
                    body: form
                });

                const uploaded = await upload.json();
                avatarUrl = uploaded?.url || null;
            }

            const res = await gqlClient.request(SIGN_UP,
                {

                    name,
                    email,
                    password,
                    avatar: avatarUrl

                }
            )
           

            router.push("/main");

        } catch (e: any) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page flex items-center justify-center">

            <div className="card w-95 ">

                <h1 className="text-2xl font-bold mb-4 text-center">
                    Create Account
                </h1>

                {error && (
                    <p className="text-red-500 mb-3 text-sm">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <input
                        placeholder="Name"
                        className="card focus-within:bg-amber-200 outline-0"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

                    <input
                        placeholder="Email"
                        type="email"
                        className="card focus-within:bg-amber-200 outline-0"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <input
                        placeholder="Password (min 8)"
                        type="password"
                        className="card focus-within:bg-amber-200 outline-0 "
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <input
                        title="a"
                        type="file"
                        className="btn-rect !bg-amber-200"
                        onChange={e => setAvatar(e.target.files?.[0] || null)}

                    />

                    <button
                        disabled={loading}
                        className="btn-rect mt-2"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>

                </form>

                <p className="text-center text-sm mt-4">
                    Already have account?{" "}
                    <a href="/login" className="underline font-bold">Login</a>
                </p>

            </div>

        </main>
    );
}
