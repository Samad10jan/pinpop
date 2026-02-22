"use client"
import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import { GET_SAVED_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { PinType } from "@/src/types/types";
import { useEffect, useState } from "react";

export default function Home() {
    const [pins, setPins] = useState<PinType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getFeed() {
            try {
                const res = await gqlClient.request(GET_SAVED_PINS_QUERY);

                setPins(res?.getSavedPins || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        getFeed();
    }, []);

    if (loading) {
        return (
            <main className="page px-5 py-8">
                <Loading />
            </main>
        );
    }

    return (
        <main className="page px-5 py-8">

            {!pins.length && (
                <p className="text-center opacity-60 mt-20">
                    No pins yet
                </p>
            )}
<div className="text-center mb-5 font-extrabold text-4xl"> Saved Pins </div>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">

                {pins.map((pin) => (

                    <PinCard data={pin} key={pin.id} />

                ))}

            </div>
        </main>
    );
}