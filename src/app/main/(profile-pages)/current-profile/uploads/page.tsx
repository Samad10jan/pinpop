"use client";

import { GET_CURRENT_USER_ALL_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { CurrentUserAnalyticsResponseType } from "@/src/types/types";
import { Heart, MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CurrentUserUploadsPage() {
    const [stats, setStats] = useState<CurrentUserAnalyticsResponseType>();

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

    // values     
    const statCards2 = [

        ["Likes", stats.totalLikes, "bg-[var(--red)]!"],
        ["Saves", stats.totalSaves, "bg-[var(--teal)]!"],
        ["Comments", stats.totalComments, "bg-white!"],
        ["Impact", stats.avgEngagementPerPin?.toFixed(2), "bg-white!"],
    ];

    const statCards1 = [
        { label: "Followers", value: stats.followersCount },
        { label: "Following", value: stats.followingCount },
        // { label: "Pins", value: stats.totalPins },
    ]
    console.log(stats.pins);
    

    return (

        <div className="">

            <div className="flex flex-col md:flex-row md:mt-5 md:items-center md:justify-between gap-4 mb-8">

                <div className="flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-black ">
                        Dashboard
                    </h1>
                    <div className="mt-3 flex gap-2">
                        <div className="h-1 w-12 bg-black rounded-full" />
                        <div className="h-1 w-4 bg-(--orange) rounded-full" />
                        <div className="h-1 w-2 bg-(--teal) rounded-full" />
                    </div>
                </div>

                <div className="flex justify-center md:justify-end gap-3 flex-wrap">
                    {statCards1.map(({ label, value }) => (
                        <div
                            key={label}
                            className="card bg-white py-2! px-4! sm:py-3! sm:px-6! text-center min-w-23!"
                        >
                            <p className="text-base sm:text-lg md:text-2xl font-black">
                                {value}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
                {statCards2.map(([l, v, b]) => (
                    <div key={l} className={`card ${b} px-1! py-2! rounded-md! text-center!`}>
                        <p className="text-sm sm:text-lg md:text-2xl font-black">{v}</p>
                        <p className="text-[8px] text-xs lg:text-base uppercase md:tracking-widest truncate md:whitespace-normal">
                            {l}
                        </p>
                    </div>
                ))}
            </div>

            {stats.topPins?.length > 0 && (
                <>
                    <h2 className="text-base sm:text-lg md:text-xl font-black uppercase mb-4">
                        Top Pins
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 mb-10">
                        {stats.topPins.map((pin) => (
                            <div key={pin.id} className="card overflow-hidden! p-2! sm:p-3!">

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

            <div className="flex flex-row justify-between items-center gap-3 mb-4">
                <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-widest">
                    All Uploads
                </h2>
                <div className="flex justify-end">
                    <div className="card bg-orange-400 text-white! px-2! py-2! rounded-md! text-sm! md:text-base! font-semibold!">
                        {stats.totalPins} pins
                    </div>
                </div>
            </div>


            {stats.pins.length === 0 ? (
                <div className="card bg-white text-center! py-14!">
                    No pins yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 mb-10">
                    {stats.pins.map((pin) => (
                        <div key={pin.id} className="card overflow-hidden! p-2! sm:p-3!">

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

    );
}
