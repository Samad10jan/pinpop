"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIGN_UP, SEND_SIGNUP_OTP } from "@/src/lib/gql/mutations/mutations";
import gqlClient from "@/src/lib/services/graphql";
import { getGraphQLError } from "@/src/helper/ApiError";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";
import Image from "next/image";
import Link from "next/link";
import { UploadIcon } from "lucide-react";


const MAX_SIZE = 10 * 1024 * 1024;

export default function SignupPage() {
    const router = useRouter();
    const toast = useToast();

    const [step, setStep] = useState<"form" | "otp">("form");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function validateAvatar(file: File) {
        if (file.size > MAX_SIZE) throw new Error("File size exceeded");
        if (!["image/jpeg", "image/png"].includes(file.type)) throw new Error("Only JPEG/PNG allowed");
    }

    async function handleSendOtp() {
        setLoading(true);
        try {
            if (!name.trim()) throw new Error("Name required");
            if (!email.includes("@")) throw new Error("Invalid email");
            if (password.length < 8) throw new Error("Password must be 8+ chars");
            if (avatar) validateAvatar(avatar);

            await gqlClient.request(SEND_SIGNUP_OTP, { email });
            setStep("otp");
        } catch (e: any) {
            toast.error(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    async function handleSignup() {
        setLoading(true);
        try {
            if (!otp || otp.length < 6) throw new Error("Invalid OTP");

            let avatarUrl = null;

            if (avatar) {

                validateAvatar(avatar);
                const form = new FormData();
                form.append("file", avatar);

                const upload = await fetch("/api/upload/avatar", { method: "POST", body: form });
                if (!upload.ok) throw new Error("Avatar upload failed");
                const uploaded = await upload.json();
                avatarUrl = uploaded?.url || null;
            }

            await gqlClient.request(SIGN_UP, { name, email, password, avatar: avatarUrl, otp });
            toast.success("Account created!");
            router.push("/main");
        } catch (e: any) {
            toast.error(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page flex bg-black">
            {/* passing toasts from useToast which is an array, we add messages and remove after 3 sec auto or using functions */}
            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />


            <div className="hidden relative md:flex w-1/2 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0a0a]">

              
                <Image
                    src="/signup.jpg"
                    alt="Sign up"
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

            <div className="flex flex-col justify-center w-full md:w-1/2 px-16 py-12 bg-[#f5f0ea] min-h-screen">


                <div className="mb-8 fade-up">
                    <h1 className="text-4xl font-bold">
                        {step === "otp" ? "Check your\nemail" : "Create\nAccount"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {step === "otp"
                            ? `OTP sent to ${email}`
                            : "Fill in the details below to get started."}
                    </p>
                </div>


                {step === "form" && (
                    <div className="flex flex-col gap-4 fade-up">
                        <input
                            placeholder="Full name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="card bg-white p-3 text-sm outline-none w-full"
                        />
                        <input
                            placeholder="Email address"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="card bg-white p-3 text-sm outline-none w-full"
                        />
                        <input
                            placeholder="Password (min 8 chars)"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="card bg-white p-3 text-sm outline-none w-full"
                        />

                        <label className="card bg-white p-3 flex items-center gap-3 cursor-pointer justify-between">
                            <span className="text-sm text-gray-500">
                                {avatar ? avatar.name : "Upload avatar (optional)"}
                            </span>
                            <input
                                title="avatar upload"
                                type="file"
                                className="hidden"
                                onChange={e => setAvatar(e.target.files?.[0] || null)}

                            />
                            <UploadIcon />
                        </label>

                        <button
                            disabled={loading}
                            onClick={handleSendOtp}
                            className="btn-rect w-full mt-2 disabled:opacity-50"
                        >
                            {loading ? "Sending OTP…" : "Continue →"}
                        </button>
                    </div>
                )}

                {step === "otp" && (
                    <div className="flex flex-col gap-4 fade-up">
                        <input
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="card bg-white p-3 outline-none w-full text-center tracking-widest text-sm"
                        />
                        <button
                            disabled={loading}
                            onClick={handleSignup}
                            className="btn-rect w-full disabled:opacity-50"
                        >
                            {loading ? "Verifying…" : "Verify & Create Account"}
                        </button>
                        <button onClick={handleSendOtp} className="text-sm underline text-center">
                            Resend OTP
                        </button>
                    </div>
                )}

                <div className="text-sm mt-8 text-gray-500">
                    Already have an account?{" "}
                    <Link href="/signin" className="underline font-bold text-black">SignIn</Link>
                </div>
            </div>
        </main>
    );
}