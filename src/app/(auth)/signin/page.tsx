"use client";

import { LOGIN } from "@/src/lib/gql/mutations/mutations";
import gqlClient from "@/src/lib/services/graphql";
import { getGraphQLError } from "@/src/helper/ApiError";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";
import Image from "next/image";

export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!email.includes("@")) throw new Error("Invalid email");
            if (password.length < 8) throw new Error("Password must be 8+ chars");

            await gqlClient.request(LOGIN, { email, password });

            // toast.success("Welcome back!");
            router.push("/main");

        } catch (e: any) {
            toast.error(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    return (
       <main className="page flex">
    <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

   
    <div className="flex flex-col justify-center w-full md:w-1/2 px-16 py-12 bg-[#f5f0ea] min-h-screen">

        <div className="mb-8 fade-up">
            <h1 className="text-4xl font-bold">Welcome<br />Back!</h1>
            <p className="text-sm text-gray-500 mt-2">Login to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 fade-up">
            <input
                placeholder="Email address"
                type="email"
                className="card bg-white p-3 text-sm outline-none w-full focus:bg-amber-50"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Password (min 8 chars)"
                type="password"
                className="card bg-white p-3 text-sm outline-none w-full focus:bg-amber-50"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button disabled={loading} className="btn-rect w-full mt-2 disabled:opacity-50">
                {loading ? "Logging in…" : "Login"}
            </button>
        </form>

        <p className="text-sm mt-8 text-gray-500">
            New here?{" "}
            <Link href="/signup" className="underline font-bold text-black">Sign Up</Link>
        </p>

    </div>

  
    <div className="hidden md:flex w-1/2 bg-[#FE7F2D] relative">
        <Image
            src="/login-illustration.png"
            alt="Login"
            fill
            className="object-cover"
        />
    </div>

</main>
    );
}