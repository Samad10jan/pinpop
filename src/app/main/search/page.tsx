"use client";

import { useSearchParams } from "next/navigation";
import PinCard from "@/src/components/cards/PinCard";
import { SEARCH_PAGE_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    const { pins, loading, observerRef } = useInfinitePins(
        SEARCH_PAGE_PINS_QUERY,
        { search: q },
        "getSearchPagePins"
    );

    if (!q) {
        return <div className="text-center mt-20">No search query</div>;
    }

    if (loading && !pins.length) {
        return <Loading />;
    }

    if (!pins.length) {
        return (
            <p className="text-center opacity-60 mt-20">
                No pins found for "{q}"
            </p>
        );
    }

    return (
        <div className="">
            <h2 className="text-xl font-bold mb-4">
                Results for "{q}"
            </h2>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {pins.map((pin) => (
                    <PinCard key={pin.id} data={pin} />
                ))}
            </div>

            <div ref={observerRef} className="flex justify-center mt-6">
                {loading && <Loading />}
            </div>
        </div>
    );
}