"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { GET_SAVED_PINS_QUERY } from "@/src/lib/gql/queries/queries";


export default function SavedPage() {
    const { pins, loading, observerRef } = useInfinitePins(
        GET_SAVED_PINS_QUERY,
        {},
        "getSavedPins"
    );

    // if (!loading && pins.length === 0)
    //     return <p className="text-center mt-20">Nothing saved yet</p>;


    return (
        <main className="relative min-h-screen px-6 py-12">

            <div className="text-center mx-auto mb-14">
                <div className="text-6xl font-black tracking-tighter">
                    Saved
                    <span className="italic text-rose-500 ml-4">Pins</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-1 w-12 bg-black rounded-full" />
                    <div className="h-1 w-4 bg-(--orange) rounded-full" />
                    <div className="h-1 w-2 bg-(--teal) rounded-full" />
                </div>
            </div>

            {loading ? <Loading /> : (
                <div className="max-w-screen-2xl mx-auto">
                    <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
                        {pins.map((pin) => (
                            <PinCard key={pin.id} data={pin} />
                        ))}
                    </div>
                </div>
            )
            }

            {
                (!loading && pins.length === 0) &&
                <p className="text-center mt-20">Nothing saved yet</p>
            }



            <div ref={observerRef} className="flex justify-center mt-6">
                {loading && <Loading />}
            </div>

        </main>
    );
}