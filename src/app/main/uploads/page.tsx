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
            <div className="container mx-auto px-5 py-5 md:py-10">

                <div className="flex flex-col md:flex-row mt-5 md:items-center md:justify-between gap-4 mb-8">

                    <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-center md:text-left">
                        My Dashboard
                    </h1>

                    <div className="flex justify-center md:justify-end gap-3 flex-wrap">
                        {["Followers", "Following"].map((k, i) => (
                            <div
                                key={k}
                                className="card bg-white py-2 px-4 sm:py-3 sm:px-6 text-center min-w-22.5"
                            >
                                <p className="text-base sm:text-lg md:text-2xl font-black">
                                    {i === 0 ? stats.followersCount : stats.followingCount}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500">{k}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    {statCards.map(([l, v, b]) => (
                        <div key={l as string} className={`card ${b} text-center py-3 sm:py-6`}>
                            <p className="text-lg sm:text-xl md:text-3xl font-black">{v}</p>
                            <p className="text-[10px] sm:text-xs uppercase tracking-widest">{l}</p>
                        </div>
                    ))}
                </div>

                {stats.topPins?.length > 0 && (
                    <>
                        <h2 className="text-base sm:text-lg md:text-xl font-black uppercase mb-4">
                            Top Pins
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 mb-10">
                            {stats.topPins.map((pin: any) => (
                                <div key={pin.id} className="card overflow-hidden p-2 sm:p-3">

                                    <div className="relative aspect-4/3 mb-2">
                                        {pin.mediaUrl ? (
                                            <Image
                                                src={pin.mediaUrl}
                                                alt={pin.title || "Untitled"}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        ) : (
                                            <div className="bg-gray-200 w-full h-full rounded" />
                                        )}
                                    </div>

                                    <p className="font-black text-xs sm:text-sm truncate">
                                        {pin.title}
                                    </p>

                                    <div className="grid grid-cols-4 text-[10px] sm:text-xs font-bold border-t pt-2 mt-2 text-center">
                                        <p className="flex flex-col items-center"><ThumbsUp size={14} /> {pin.likesCount}</p>
                                        <p className="flex flex-col items-center"><Heart size={14} /> {pin.savesCount}</p>
                                        <p className="flex flex-col items-center"><MessageCircle size={14} /> {pin.commentsCount}</p>
                                        <p className="flex flex-col items-center"><TrendingUp size={14} /> {pin.engagementScore?.toFixed(1)}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-widest">
                        All Uploads
                    </h2>
                    <p className="card bg-white px-3 py-1 text-sm">
                        {stats.totalPins} pins
                    </p>
                </div>

                {/* ALL PINS */}
                {stats.pins.length === 0 ? (
                    <div className="card bg-white text-center py-14">
                        No pins yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 mb-10">
                        {stats.pins.map((pin: any) => (
                            <div key={pin.id} className="card overflow-hidden p-2 sm:p-3">

                                <div className="relative aspect-4/3 mb-2">
                                    {pin.mediaUrl ? (
                                        <Image
                                            src={pin.mediaUrl}
                                            alt={pin.title || "Untitled"}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 w-full h-full rounded" />
                                    )}
                                </div>

                                <p className="font-black text-xs sm:text-sm truncate">
                                    {pin.title}
                                </p>

                                <div className="grid grid-cols-4 text-[10px] sm:text-xs font-bold border-t pt-2 mt-2 text-center">
                                    <p className="flex flex-col items-center"><ThumbsUp size={14} /> {pin.likesCount}</p>
                                    <p className="flex flex-col items-center"><Heart size={14} /> {pin.savesCount}</p>
                                    <p className="flex flex-col items-center"><MessageCircle size={14} /> {pin.commentsCount}</p>
                                    <p className="flex flex-col items-center"><TrendingUp size={14} /> {pin.engagementScore?.toFixed(1)}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
