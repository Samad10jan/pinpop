"use client";

import { LOGIN } from "@/src/lib/gql/mutations/mutations";
import gqlClient from "@/src/lib/services/graphql";
import { getGraphQLError } from "@/src/helper/ApiError";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";
import Image from "next/image";

export const dynamic = 'force-dynamic';

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
            //trigger an error toast with the error message
            console.log(e.message);

            toast.error(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="page flex bg-black">

            {/* Render the ToastContainer at first 

             At first there will be nothing in Array , so no toast 
            but when we call toast.error or toast.success 
            it will add a toast to the array and 
            that will trigger re-render of ToastContainer and show the toast.
            also Auto close after 3 sec.
            Manual close by passing toast.remove to onClose, so when we click on close button of toast
            it will remove that toast from array and hide it.
    
            */}

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

            <div className="hidden relative md:flex w-1/2 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0a0a]">


                <Image
                    src="/signin.jpg"
                    alt="Signin"
                    fill
                    className="object-cover z-0 opacity-40 scale-105"
                />

                <div className="relative z-30 flex flex-col items-center gap-4 px-10 text-center select-none">


                    <h1 className="text-6xl font-black tracking-tighter text-white leading-none">
                        PIN<span className="text-[#FE7F2D]">POP</span>
                    </h1>

                    <p className="text-sm text-white/80 font-light max-w-50 leading-relaxed">
                        Collect, curate, and share what inspires you.
                    </p>
                </div>
            </div>

        </main>
    );
}