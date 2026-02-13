"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PIN_PAGE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { getGraphQLError } from "@/utils/ApiError";

import FollowBtn from "@/components/buttons/FollowBtn";
import LikeBtn from "@/components/buttons/LikeBtn";
import SaveBtn from "@/components/buttons/SaveBtn";
import PinCard from "@/components/cards/PinCard";
import CommentArea from "@/components/commons/CommentsArea";
import { FeedPinType } from "@/types/types";

export default function PinPage() {
    const { pinId } = useParams();

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pinId) return;

        async function fetchPin() {
            try {
                const res = await gqlClient.request(PIN_PAGE_QUERY, {
                    getPinResponseId: pinId,
                });

                setData(res.getPinResponse);
            } catch (e) {
                setError(getGraphQLError(e));
            } finally {
                setLoading(false);
            }
        }

        fetchPin();
    }, [pinId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 font-medium">Loading pin...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                NO Pin
            </div>
        );
    }

    if (!data) return null;

    const { pin, relatedPins } = data;

    return (



        <div className="flex gap-4 space-y-4 m-5 flex-wrap">
            <div className=" m-5">

                <div className="max-w-130 mx-auto">
                    <Image
                        src={pin.mediaUrl}
                        alt={pin.title}
                        width={700}
                        height={1000}
                        // sizes="(max-width: 700px) 90vw, 700px"
                        className=" rounded-2xl shadow"
                        priority
                    />
                </div>

                <div className="">
                    <div className=" p-3 w-full">
                        <div className="flex *:flex-1">
                            <div className="">


                                <p className="font-semibold text-xl line-clamp-2">
                                    {pin.title}
                                </p>
                                <p className="font-semibold text-sm text-gray-500  line-clamp-2">
                                    {pin.description}
                                </p>

                            </div>


                            <div className="flex justify-self-end mb-8 gap-3">

                                <SaveBtn />

                                <LikeBtn />
                                <a
                                    href={pin.mediaUrl}
                                    download
                                    target="_blank"
                                    title={pin.title}
                                    className="btn-rect bg-red-600! text-white  px-6! py-3! rounded-full! text-sm! font-semibold!"
                                >
                                    Download
                                </a>
                            </div>



                        </div>


                        <div className="mb-10 pb-8 border-b">
                            <div className="flex justify-between items-center">

                                <div className="flex gap-4 items-center">
                                    <Image
                                        src={pin.user.avatar}
                                        alt={pin.user.name}
                                        width={56}
                                        height={56}
                                        className="rounded-full"
                                    />

                                    <div>
                                        <h3 className="font-semibold">{pin.user.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {pin.followersCount || 0} followers
                                        </p>
                                    </div>
                                </div>

                                <FollowBtn />
                            </div>
                        </div>
                        <CommentArea pinId={pin.id} />
                    </div>


                </div>

            </div>
            <div className="columns-2 gap-4 w-[40%] space-y-4 m-5">


                {relatedPins.map((pin: FeedPinType) => (

                    <PinCard data={pin} key={pin.id} />

                ))}
            </div>

        </div>


    );
}


