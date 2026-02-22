"use client";

import { GET_CURRENT_USER_ALL_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { Heart, MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CurrentUserUploadsPage() {
    const [stats, setStats] = useState<any>();

    useEffect(() => {
        gqlClient
            .request(GET_CURRENT_USER_ALL_PINS_QUERY)
            .then(res => setStats(res.getCurrentUserPins));
    }, []);

    if (!stats)
        return (
            <div className="page flex items-center justify-center">
                <div className="card">Loading...</div>
            </div>
        );

    const statCards = [
        ["Pins", stats.totalPins, "bg-[var(--orange)]!"],
        ["Likes", stats.totalLikes, "bg-[var(--red)]!"],
        ["Saves", stats.totalSaves, "bg-[var(--teal)]!"],
        ["Comments", stats.totalComments, "bg-white!"],
        ["Avg Engagement", stats.avgEngagementPerPin?.toFixed(2), "bg-white!"],
    ];

    return (
        <div className="page">
            <div className="container py-10!">

                <div className="flex justify-between mb-10">
                    <h1 className="text-4xl font-black">My Dashboard</h1>
                    <div className="flex gap-3">
                        {["Followers", "Following"].map((k, i) => (
                            <div key={k} className="card text-center bg-white!">
                                <p className="text-2xl font-black">
                                    {i === 0 ? stats.followersCount : stats.followingCount}
                                </p>
                                <p className="text-xs text-gray-500">{k}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex *:flex-1  gap-4 mb-12">
                    {statCards.map(([l, v, b]) => (
                        <div key={l as string} className={`card ${b}`}>
                            <p className="text-3xl font-black">{v}</p>
                            <p className="text-xs uppercase tracking-widest">{l}</p>
                        </div>
                    ))}
                </div>

                {stats.topPins?.length > 0 && (
                    <>
                        <h2 className="text-xl font-black uppercase mb-5">Top Pins</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
                            {stats.topPins.map((pin: any) => (
                                <div key={pin.id} className="card">
                                    <div className="h-44 mb-3 relative">
                                        {pin.mediaUrl ? (
                                            <Image src={pin.mediaUrl} alt={pin.title || "Untitled"} fill className="object-cover" />
                                        ) : (
                                            <div className="bg-gray-200 w-full h-full" />
                                        )}
                                    </div>
                                    <p className="font-black text-sm truncate">{pin.title}</p>
                                    <div className="flex justify-between *:flex *:flex-col *:justify-center *:items-center text-xs font-bold border-t-2 border-black pt-3 mt-3">
                                        <p><ThumbsUp /> {pin.likesCount}</p>
                                        <p><Heart /> {pin.savesCount}</p>
                                        <p><MessageCircle />{pin.commentsCount}</p>
                                        <p><TrendingUp />{pin.engagementScore?.toFixed(1)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex justify-between mb-5">
                    <h2 className="text-xl font-black uppercase tracking-widest">All Uploads</h2>
                    <p className="card bg-white! py-1! px-4!">{stats.totalPins} pins</p>
                </div>

                {stats.pins.length === 0 ? (
                    <div className="card bg-white! text-center py-20">No pins yet.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {stats.pins.map((pin: any) => (
                            <div key={pin.id} className="card">
                                <div className=" h-44 mb-3 relative">
                                    {pin.mediaUrl ? (
                                        <Image src={pin.mediaUrl} alt={pin.title || "Untitled"} fill className="object-cover" />
                                    ) : (
                                        <div className="bg-gray-200 w-full h-full" />
                                    )}
                                </div>
                                <p className="font-black text-sm truncate">{pin.title}</p>
                                <div className="flex justify-between *:flex *:flex-col *:justify-center *:items-center text-xs font-bold border-t-2 border-black pt-3 mt-3">
                                    <p><ThumbsUp /> {pin.likesCount}</p>
                                    <p><Heart /> {pin.savesCount}</p>
                                    <p><MessageCircle />{pin.commentsCount}</p>
                                    <p><TrendingUp />{pin.engagementScore?.toFixed(1)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
