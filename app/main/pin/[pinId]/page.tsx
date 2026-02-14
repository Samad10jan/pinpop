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
import Link from "next/link";

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
                    getPinPageResponseId: pinId,
                });
                console.log(res);
                

                setData(res.getPinPageResponse);
            } catch (e) {
                setError(getGraphQLError(e));
                console.log(e);
                
            } finally {
                setLoading(false);
            }
        }

        fetchPin();
    }, [pinId]);

    if (loading) {
        return (
              <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-cyan-600 text-white">
            <p className="text-xl font-bold">Loading pin...</p>
          </div>
        </div>
      </main>
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

   const { pin, relatedPins, likesCount, savesCount,followersCount } = data;

//    console.log(pin);
   


    return (



        <div className="flex gap-4 space-y-4 m-5 flex-wrap">
            <div className=" m-5">

                <div className="max-w-130 mx-auto">
                    <Image
                        src={pin.mediaUrl}
                        alt={pin.title}
                        width={700}
                        height={1000}
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

                               <SaveBtn pinId={pin.id} isSaved={pin.isSaved} />


                                <LikeBtn pinId={pin.id} isLiked={pin.isLiked}  />
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
                            <div className="flex justify-between items-center p-3 rounded-2xl ">

                                <div className="flex gap-4 items-center ">

                                    <Link href={`/main/profile/${pin.user.id}`} className="group relative overflow-hidden rounded-full hover:ring-2 p-2 hover:ring-amber-500 transition-all duration-300">
                                        <Image
                                            src={pin.user.avatar}
                                            alt={pin.user.name}
                                            width={56}
                                            height={56}
                                            className="rounded-full"
                                        />
                                        <div className="absolute inset-0 w-2 h-full  bg-amber-300 blur-xs transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-1500" />

                                    </Link>
                                    <div>
                                        <h3 className="font-semibold">{pin.user.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {followersCount||0} followers
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

        </div >


    );
}


