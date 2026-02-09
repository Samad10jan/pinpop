"use client";

import { LOGIN } from "@/lib/gql/mutations/mutations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            if (!email.includes("@")) throw new Error("Invalid email");
            if (password.length < 8) throw new Error("Password must be 8+ chars");
            // if (!name.trim()) throw new Error("Name required");



            const res = await fetch("/api/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: LOGIN,
                    variables: {
                        email,
                        password,

                    }
                })
            });

            const json = await res.json();

            if (json.errors) throw new Error(json.errors[0].message);

            router.push("/main");

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page flex items-center justify-center">

            <div className="card w-95 ">

                <h1 className="text-2xl font-bold mb-4 text-center">
                    WELCOME BACK!
                </h1>

                {error && (
                    <p className="text-red-500 mb-3 text-sm">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">



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



                    <button
                        disabled={loading}
                        className="btn-rect mt-2"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-sm mt-4">
                    New User?{" "}
                    <Link href="/signup" className="underline font-bold">SignUp</Link>
                </p>

            </div>

        </main>
    );
}
