"use client";

import { UserContext } from "@/components/contexts/UserContext";
import { PROFILE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function UserPage() {
    const params = useParams();
    const userId = params.userId;
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    // console.log("a",profile);
    

    useEffect(() => {
        async function getData() {
            try {
                const {getProfile} = await gqlClient.request(PROFILE_QUERY);
                setProfile(getProfile || null);
                // console.log("asasasasa",data);
                
            } catch (err:any) {
                console.error("GraphQL error:", err.message);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    if (!currentUser || currentUser.id !== userId) {
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
    const name = user?.name || "Anonymous";
    const email = user?.email || "No email";
    const avatar = user?.avatar || "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3";
    const followers = profile?.followersCount || 0;
    const following = profile?.followingCount || 0;
    const totalPins = profile?.user?.uploadCount || 0;

    const likes = profile?.user?.totalLikes || 0
    // console.log("lieks:", likes);

    const savedFivePins = profile?.lastSavedPins || []
    const likedFivePins = profile?.lastLikedPins || []
    // console.log("a",profile?.lastLikedPins );


    return (
        <main className="page">
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

                                <button className="btn-rect w-full mb-3">
                                    Edit Profile
                                </button>

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
                                <div className="text-sm mt-1">Likes</div>
                            </div>
                        </div>


                        <div className="card mb-6 bg-white">
                            <h3 className="text-xl font-bold mb-4">Actions</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <Link href={"/main/pin"} className="btn-rect text-center py-6">
                                    <div className="text-2xl mb-2">➕</div>
                                    <div className="text-sm">Create Pin</div>
                                </Link>
                                <Link href={"/main"} className="btn-rect text-center py-6 bg-purple-600 text-white">
                                    <div className="text-2xl mb-2">🔍</div>
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
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl bg-orange-500 border-2 border-black shadow-[3px_3px_0_black] text-white">
                                        {savedFivePins.length}
                                    </div>
                                </div>


                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {savedFivePins.map((s: any) => (
                                        <div
                                            key={s.id}
                                            className="aspect-square rounded-lg bg-linear-to-br from-orange-500 to-cyan-600 border-2 border-black"
                                        />
                                    ))}
                                </div>

                                <Link href="/main/saved" className="btn-rect w-full text-center block">
                                    View All Saved
                                </Link>
                            </div>


                            {/* <div className="card bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">Created Pins</h3>
                                        <p className="text-sm opacity-70 mt-1">Your favorites</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl bg-red-500 border-2 border-black shadow-[3px_3px_0_black] text-white">
                                        {totalPins}
                                    </div>
                                </div>


                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {likedFivePins.map((l: any) => (
                                        <div
                                            key={l.id}
                                            className="aspect-square rounded-lg bg-linear-to-br from-red-500 to-orange-500 border-2 border-black"
                                        />
                                    ))}
                                </div>

                                <Link href="/main/liked" className="btn-rect w-full text-center block">
                                    View All Liked
                                </Link>
                            </div> */}
                        </div>



                    </div>
                </div>
            </div>
        </main>
    );
}