"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PIN_PAGE_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { getGraphQLError } from "@/utils/ApiError";

import PinCard from "@/components/cards/PinCard";

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
        <div className="min-h-screen ">
            <div className="max-w-300 px-6 lg:px-8 py-8 mx-auto">
                <div className="flex flex-col lg:flex-row gap-10">

                    
                    <div className="lg:w-1/2 lg:sticky lg:top-24 self-start">
                        <div className="rounded-3xl overflow-hidden">

                            <div className="relative w-full max-h-[80vh] aspect-3/4">
                                <Image
                                    src={pin.mediaUrl}
                                    alt={pin.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                    className="object-contain transition-transform duration-500 hover:scale-[1.02]"
                                />
                            </div>
 <div className="flex justify-end-safe mb-8 scale-85 gap-3">

                            <button className="btn-rect  px-6! py-3! rounded-full! text-sm! font-semibold!">
                                Save
                            </button>


                            <a
                                href={pin.mediaUrl}
                                download
                                target="_blank"
                                title={pin.title}
                                className="btn-rect  px-6! py-3! rounded-full! text-sm! font-semibold!"
                            >
                                Download
                            </a>

                            <button className="btn-rect  px-6! py-3! rounded-full! text-sm! font-semibold!">
                                Share
                            </button>

                        </div>

                        </div>
                        
                    </div>

                  
                    <div className="lg:w-1/2 flex flex-col">


                       

                        <div className="mb-8 ">
                            <h1 className="text-4xl font-bold mb-4">{pin.title}</h1>

                            {pin.description && (
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {pin.description}
                                </p>
                            )}
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

                                <button className="btn-rect bg-red-600! text-white px-6! py-3! rounded-full! text-sm! font-semibold!">
                                    Follow
                                </button>
                            </div>
                        </div>

                        <div>
                            Comments Area
                        </div>

                    </div>
                </div>
            </div>

            {relatedPins?.length > 0 && (
                <div className="max-w-400 mx-auto px-6 py-16  mt-12">

                    <h2 className="text-3xl font-bold mb-8">More like this</h2>

                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4">
                        {relatedPins.map((p: any) => (
                            <div key={p.id} className="mb-4 break-inside-avoid">
                                <PinCard data={p} />
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}
