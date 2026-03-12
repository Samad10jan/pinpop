"use client";

import EditDetailsArea from "@/src/components/commons/EditDetailsArea";
import { UserContext } from "@/src/components/contexts/UserContext";
import { CURRENT_PROFILE_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { CurrentProfileType, UserType } from "@/src/types/types";
import { Pin, PlusCircleIcon, Search, SearchIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function UserPage() {
    const [profile, setProfile] = useState<CurrentProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const context = useContext(UserContext);
    const currentUser = context?.currentUser; const [showEdit, setShowEdit] = useState(false);


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
            <main className=" p-8">


                <div className="mb-8 relative">
                    
                    <div className="text-4xl md:text-5xl font-bold mb-1 text-center">Dashboard</div>
                    <div className="text-lg opacity-70 flex justify-center ">Welcome back, <div className="font-black text-(--orange)]">{name.split(' ')[0]}</div>!</div>
                    
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-1 w-12 bg-black rounded-full" />
                        <div className="h-1 w-4 bg-(--orange) rounded-full" />
                        <div className="h-1 w-2 bg-(--teal) rounded-full" />
                    </div>
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
                                <div className="text-2xl font-bold mb-1">{name}</div>
                                <div className="text-sm opacity-70 mb-4">{email}</div>

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


                        <div className=" card flex flex-col gap-4 mb-6 ">
                            <div className="flex *:flex-1 md:flex-row flex-col gap-4">
                                <div className="card text-center btn-rect bg-orange-400! text-white relative overflow-hidden! group ">
                                    <div className="text-3xl font-bold">{totalPins}</div>
                                    <div className="text-sm mt-1">Total Pins</div>
                                    <div className="card absolute inset-0 h-full rounded-4xl w-[30%]  bg-purple-600 transform -translate-x-15 group-hover:-translate-x-10  transition-all duration-900 flex justify-end items-center pr-5! group-hover:pr-8!" ><Pin /></div>

                                </div>


                                <div className="card text-center btn-rect bg-purple-600! text-white relative overflow-hidden! group">
                                    <div className="text-3xl font-bold">{likes}</div>
                                    <div className="text-sm mt-1">Pins Liked</div>
                                    <div className="card absolute inset-0 h-full rounded-4xl w-[30%]  bg-orange-400 transform -translate-x-15 group-hover:-translate-x-10  transition-all duration-900 flex justify-end items-center pr-5! group-hover:pr-8!" ><ThumbsUpIcon /></div>
                                </div>
                            </div>
                            <Link href={"/main/uploads"} className="btn-rect text-center! bg-teal-500! ">
                                View Details

                            </Link>

                        </div>



                        <div className="card mb-6 bg-white">
                            <h3 className="text-xl font-bold mb-4">Actions</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <Link href={"/main/pin"} className="btn-rect flex flex-col justify-center items-center py-6 ">

                                    <div className=" mb-3">

                                        <PlusCircleIcon color="white" />                                                                            </div>

                                    <div className="text-sm text-white">Create Pin</div>

                                </Link>
                                <Link href={"/main"} className="btn-rect flex flex-col justify-center items-center py-6 bg-purple-600 text-white">

                                    <div className=" mb-3">
                                        <SearchIcon color="white" />
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
                                        <div key={s.id} className="relative max-w-50 h-20 mb-4 group rounded-2xl overflow-hidden hover:shadow-xl transition-all">

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
            </main>
       
    );
}
