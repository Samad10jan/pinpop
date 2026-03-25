"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import gqlClient from "@/src/lib/services/graphql";
import { GET_A_USER_ALL_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import { getGraphQLError } from "@/src/helper/ApiError";

import PinCard from "@/src/components/cards/PinCard";
import { PinType } from "@/src/types/types";
import Masonry from "react-masonry-css";
import { breakpointCols } from "@/src/lib/constants";

export default function UserUploadsPage() {
    const { userId } = useParams();

    const [pins, setPins] = useState<PinType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;

        async function fetchPins() {
            try {
                const res = await gqlClient.request(
                    GET_A_USER_ALL_PINS_QUERY,
                    {
                        userId,
                    }
                );

                setPins(res.getUserAllPins.pins || []);
            } catch (e) {
                setError(getGraphQLError(e));
            } finally {
                setLoading(false);
            }
        }

        fetchPins();
    }, [userId]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Loading pins...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </main>
        );
    }

    return (
        <main className="">
            <div className="flex flex-col items-center mb-5">
                <h1 className="text-2xl md:text-5xl font-black ">
                    {pins[1].user.name.split(" ")[0]}'s Uploads
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

            <Masonry
                breakpointCols={breakpointCols}
                className="masonry-grid"
                columnClassName="masonry-grid-col"
            >
                {pins.map((pin: PinType) => (
                    <PinCard data={pin} key={pin.id} />
                ))}
            </Masonry>

        </main>
    );
}