"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import gqlClient from "@/src/lib/services/graphql";
import { GET_A_USER_ALL_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import { getGraphQLError } from "@/src/helper/ApiError";

import PinCard from "@/src/components/cards/PinCard";
import { PinType } from "@/src/types/types";

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
        <main className="px-4 py-8">
            <h1 className="text-4xl font-black mb-5">{pins[1].user.name.split(" ")[0]}'s Pins</h1>
            {!pins.length && (
                <p className="text-center opacity-60 mt-20 text-lg">
                    No pins yet
                </p>
            )}

            <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
                {pins.map((pin: PinType) => (
                    <PinCard data={pin} key={pin.id} />
                ))}
            </div>

        </main>
    );
}