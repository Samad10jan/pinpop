"use client";

import EditDetailsArea from "@/components/commons/EditDetailsArea";
import { UserContext } from "@/components/contexts/UserContext";
import { CURRENT_PROFILE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { CurrentProfileType, UserType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function UserPage() {
    const [profile, setProfile] = useState<CurrentProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    const [showEdit, setShowEdit] = useState(false);


    useEffect(() => {
        async function getData() {
            try {
                const data = await gqlClient.request(CURRENT_PROFILE_QUERY);
                setProfile(data?.getCurrentProfile || null);
            } catch (err: any) {
                console.error("GraphQL error:", err.message);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }

        if (currentUser) getData();
    }, [currentUser]);

    // not logged in
    if (!currentUser && !loading) {
        return (
            <main className="page">
                <div className="container">
                    <div className="card max-w-md mx-auto mt-20 text-center bg-red-500 text-white">
                        <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
                        <p>You don't have permission to view this page.</p>
                    </div>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="page">
                <div className="container">
                    <div className="card max-w-md mx-auto mt-20 text-center bg-cyan-600 text-white">
                        <p className="text-xl font-bold">Loading your dashboard...</p>
                    </div>
                </div>
            </main>
        );
    }

    const user = profile?.user || {};
    const name = profile?.user?.name || "Anonymous";
    const email = profile?.user?.email || "No email";
    const avatar =
        profile?.user?.avatar ||
        "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3";

    const followers = profile?.followersCount || 0;
    const following = profile?.followingCount || 0;
    const totalPins = profile?.user?.uploadCount || 0;
    const likes = profile?.totalLikes || 0;
    const lastSavedPins = profile?.lastSavedPins || [];

    return (
        <main className="page pt-8">
            <div className="container py-8">


                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Dashboard</h1>
                    <p className="text-lg opacity-70">Welcome back, {name.split(' ')[0]}!</p>
                </div>


                <div className="grid lg:grid-cols-12 gap-6">


                    <div className="lg:col-span-4">
                        <div className="card sticky top-8 bg-white">


                            <div className="flex justify-center mb-6 ">
                                <div className=" relative w-32! h-32! btn-circle overflow-hidden! ">
                                    <div className=" absolute w-full h-full ">

                                        <Image
                                            src={avatar}
                                            alt={`${name}'s avatar`}
                                            fill
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-1">{name}</h2>
                                <p className="text-sm opacity-70 mb-4">{email}</p>

                                <button className="btn-rect w-full mb-3" onClick={() => setShowEdit(true)} >
                                    Edit Profile
                                </button>

                                {showEdit && (
                                    <EditDetailsArea
                                        userData={profile?.user as UserType}
                                        onClose={() => setShowEdit(false)}
                                    />
                                )}
                            </div>


                            <div className="grid grid-cols-2 gap-3 p-4 rounded-lg mb-4 bg-[#F0E7D6] border-2 border-black">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{followers}</div>
                                    <div className="text-xs opacity-70">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{following}</div>
                                    <div className="text-xs opacity-70">Following</div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="lg:col-span-8">

                        <div className="grid md:grid-cols-2 gap-4 mb-6">

                            <div className="card text-center btn-rect bg-orange-500! text-white">
                                <div className="text-3xl font-bold">{totalPins}</div>
                                <div className="text-sm mt-1">Total Pins</div>
                            </div>

                            <div className="card text-center btn-rect bg-purple-600! text-white">
                                <div className="text-3xl font-bold">{likes}</div>
                                <div className="text-sm mt-1">Pins Liked</div>
                            </div>
                        </div>


                        <div className="card mb-6 bg-white">
                            <h3 className="text-xl font-bold mb-4">Actions</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <Link href={"/main/pin"} className="btn-rect flex flex-col justify-center items-center py-6 ">

                                    <div className=" mb-3">

                                        <svg width="30" height="30" color="white" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>                                    </div>

                                    <div className="text-sm text-white">Create Pin</div>

                                </Link>
                                <Link href={"/main"} className="btn-rect flex flex-col justify-center items-center py-6 bg-purple-600 text-white">

                                    <div className=" mb-3">
                                        <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>

                                    </div>
                                    <div className="text-sm">Explore</div>
                                </Link>
                            </div>
                        </div>


                        <div className="grid md:grid-cols-1 gap-6 mb-6">


                            <div className="card bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">Saved Pins</h3>
                                        <p className="text-sm opacity-70 mt-1">Your collection</p>
                                    </div>
                                    <div className="btn-circle bg-orange-400">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" color="white" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>

                                    </div>
                                </div>


                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {lastSavedPins.map((s: any) => (
                                        <div key={s.id} className="relative w-62 h-40 mb-4 group rounded-2xl overflow-hidden hover:shadow-xl transition-all">

                                            <div className=" absolute w-full h-full">

                                                <Image
                                                    src={s.mediaUrl}
                                                    alt={s.title}
                                                    fill
                                                    className="w-full h-auto object-cover"
                                                    loading="lazy"
                                                />


                                                <Link href={`/main/pin/${s.id}`}>
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40">
                                                        <div className="absolute bottom-0 p-3 w-full">
                                                            <p className="font-semibold text-sm text-white line-clamp-2">
                                                                {s.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>




                                            </div>

                                        </div>
                                    ))}
                                </div>

                                <Link href="/main/saved" className="btn-rect w-full text-center block">
                                    View All Saved
                                </Link>
                            </div>



                        </div>



                    </div>
                </div>
            </div>
        </main>
    );
}
