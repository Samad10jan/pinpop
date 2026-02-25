"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIGN_UP, SEND_SIGNUP_OTP } from "@/src/lib/gql/mutations/mutations";
import gqlClient from "@/src/lib/services/graphql";
import { getGraphQLError } from "@/src/helper/ApiError";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function SignupPage() {
    const router = useRouter();

    const [step, setStep] = useState<"form" | "otp">("form");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //  STEP 1: Send OTP
    async function handleSendOtp() {
        setLoading(true);
        setError("");

        try {
            if (!email.includes("@")) throw new Error("Invalid email");
            if (password.length < 8) throw new Error("Password must be 8+ chars");
            if (!name.trim()) throw new Error("Name required");
            if (avatar) {

                if (avatar.size > MAX_SIZE) {
                    throw Error("File Size Exceeded");


                }


                if (!["image/jpeg", "image/png"].includes(avatar.type)) {
                    throw Error("Only Image Type Valid");

                }
            }

            await gqlClient.request(SEND_SIGNUP_OTP, { email });

            setStep("otp");

        } catch (e: any) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    //  STEP 2: Complete Signup
    async function handleSignup() {
        setLoading(true);
        setError("");
        if (!otp || otp.length < 6)
            throw new Error("Invalid OTP");

        try {
            let avatarUrl = null;

            if (avatar) {


                if (avatar.size > MAX_SIZE) {
                    throw Error("File Size Exceeded");


                }


                if (!["image/jpeg", "image/png"].includes(avatar.type)) {
                    throw Error("Only Image Type Valid");

                }

                const form = new FormData();
                form.append("file", avatar);

                const upload = await fetch("/api/upload/avatar", {
                    method: "POST",
                    body: form,
                });
                if (!upload.ok) {
                    throw new Error("Avatar upload failed");
                }
                const uploaded = await upload.json();
                avatarUrl = uploaded?.url || null;
            }

            await gqlClient.request(SIGN_UP, {
                name,
                email,
                password,
                avatar: avatarUrl,
                otp,
            });

            router.push("/main");
        } catch (e: any) {
            setError(getGraphQLError(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page flex items-center justify-center">
            <div className="card w-95">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Create Account
                </h1>

                {error && (
                    <p className="text-red-500 mb-3 text-sm">{error}</p>
                )}

                {/* STEP 1 */}
                {step === "form" && (
                    <div className="flex flex-col gap-3">

                        <input
                            placeholder="Name"
                            className="card"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <input
                            placeholder="Email"
                            type="email"
                            className="card"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <input
                            placeholder="Password (min 8)"
                            type="password"
                            className="card"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <input
                            title="avatar upload"
                            type="file"
                            className="btn-rect bg-amber-200!"
                            onChange={e => setAvatar(e.target.files?.[0] || null)}
                        />

                        <button
                            disabled={loading}
                            onClick={handleSendOtp}
                            className="btn-rect mt-2"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === "otp" && (
                    <div className="flex flex-col gap-3">

                        <p className="text-sm text-gray-500">
                            OTP sent to {email}
                        </p>

                        <input
                            placeholder="Enter OTP"
                            className="card"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                        />

                        <button
                            disabled={loading}
                            onClick={handleSignup}
                            className="btn-rect"
                        >
                            {loading ? "Creating..." : "Verify & Create Account"}
                        </button>

                        <button
                            onClick={handleSendOtp}
                            className="text-sm underline"
                        >
                            Resend OTP
                        </button>

                    </div>
                )}

                <p className="text-center text-sm mt-4">
                    Already have account?{" "}
                    <a href="/login" className="underline font-bold">Login</a>
                </p>

            </div>
        </main>
    );
}