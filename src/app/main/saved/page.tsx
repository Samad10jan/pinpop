"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { breakpointCols } from "@/src/lib/constants";
import { GET_SAVED_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import Masonry from "react-masonry-css";


export default function SavedPage() {
    const { pins, loading, observerRef } = useInfinitePins(
        GET_SAVED_PINS_QUERY,
        {},
        "getSavedPins"
    );

    // if (!loading && pins.length === 0)
    //     return <p className="text-center mt-20">Nothing saved yet</p>;
    if (loading && !pins.length) {
        return <Loading />;
    }

    return (
        <main className="relative min-h-screen">


            <div className="flex flex-col items-center mb-5">
                <div className="text-4xl md:text-5xl font-black ">
                    Saved
                    <span className="italic text-rose-500 ml-4">Pins</span>
                </div>
                <div className="mt-3 flex gap-2">
                    <div className="h-1 w-12 bg-black rounded-full" />
                    <div className="h-1 w-4 bg-(--orange) rounded-full" />
                    <div className="h-1 w-2 bg-(--teal) rounded-full" />
                </div>
            </div>



            <Masonry
                breakpointCols={breakpointCols}
                className="masonry-grid"
                columnClassName="masonry-grid-col"
            >
                {pins.map((pin) => (
                    <PinCard key={pin.id} data={pin} />
                ))}
            </Masonry>


            {
                (!loading && pins.length === 0) &&
                <p className="text-center mt-20">Nothing saved yet</p>
            }

            <div ref={observerRef} className="flex justify-center mt-6">
            </div>

        </main>
    );
}