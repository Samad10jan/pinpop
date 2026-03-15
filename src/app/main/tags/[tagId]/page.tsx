"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { tags } from "@/src/lib/constants";
import { GET_PINS_BY_TAG_QUERY } from "@/src/lib/gql/queries/queries";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { tagId } = useParams();

    const [tagName, setTagName] = useState("Tag");

    const { pins, loading, observerRef } = useInfinitePins(
        GET_PINS_BY_TAG_QUERY,
        { tagId },
        "getPinsByTag"
    );

    useEffect(() => {
        function getTagName(id: string) {
            const tag = tags.find((t) => t.id === id);
            return tag?.name || "Tag";
        }

        if (tagId) setTagName(getTagName(tagId as string));
    }, [tagId]);

    if (!loading && pins.length === 0)
        return (
            <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
                <div className="card text-center px-12 py-10 bg-white">
                    <p className="text-2xl font-black tracking-tight">
                        No Pin For{" "}
                        <span className="capitalize text-rose-500">{tagName}</span> Yet
                    </p>
                </div>

                <Link
                    href={"/main/pin"}
                    className="btn-rect mt-3 flex flex-col justify-center items-center"
                >
                    Be First!! <PlusCircleIcon />
                </Link>
            </div>
        );

    return (
        <main className="relative min-h-screen">

            <div className="text-center mx-auto mb-14">
                <div className="text-4xl md:text-6xl capitalize font-black tracking-tighter">
                    {tagName}
                    <span className="italic text-rose-500 ml-4">Pins</span>
                </div>
            </div>

            {loading ? <Loading /> : (
                <div className="max-w-screen-2xl mx-auto">
                    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
                        {pins.map((pin) => (
                            <PinCard key={pin.id} data={pin} />
                        ))}
                    </div>
                </div>)}

            <div ref={observerRef} className="flex justify-center mt-6">
                {loading && <Loading />}
            </div>

        </main>
    );
}