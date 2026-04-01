"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getGraphQLError } from "@/src/helper/ApiError";
import { GET_A_USER_ALL_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";

import PinCard from "@/src/components/cards/PinCard";
import { PinType } from "@/src/types/types";

import { Masonry } from "masonic";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";


export default function UserUploadsPage() {
    const { userId } = useParams();

    // const [pins, setPins] = useState<PinType[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    const { pins, loading, observerRef, hasNextPage, } = useInfinitePins(

        GET_A_USER_ALL_PINS_QUERY,
        { userId },
        "getUserAllPins"
    )

    if (loading && pins.length === 0) return <Loading />;


    return (
        <main className="">
            <div className="flex flex-col items-center mb-5">
                <h1 className="text-2xl md:text-5xl font-black">
                    {pins[0]?.user?.name?.split(" ")[0] ?? "User"}'s Uploads
                </h1>
                <div className="mt-3 flex gap-2">
                    <div className="h-1 w-12 bg-black rounded-full" />
                    <div className="h-1 w-4 bg-(--orange) rounded-full" />
                    <div className="h-1 w-2 bg-(--teal) rounded-full" />
                </div>
            </div>

            {!pins.length && (
                <p className="text-center opacity-60 mt-20 text-lg">
                    No pins yet
                </p>
            )}


            <div className="hidden sm:flex md:flex w-full">
                <Masonry
                    items={pins}
                    columnGutter={16}
                    columnWidth={236}        // min width per column, masonic auto-calculates count   
                    itemKey={(item: PinType) => item.id}
                    render={({ data }: { data: PinType }) => <PinCard data={data} />}
                />

            </div>

            <div className="flex sm:hidden md:hidden w-full">
                <Masonry
                    items={pins}
                    columnGutter={16}
                    columnWidth={110}        // min width per column, masonic auto-calculates count 
                    itemKey={(item: PinType) => item.id}
                    render={({ data }: { data: PinType }) => <PinCard data={data} />}
                />

            </div>

            {hasNextPage && <div ref={observerRef} className="h-1" />}
        </main>
    );
}