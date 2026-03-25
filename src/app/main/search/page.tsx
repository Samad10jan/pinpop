"use client";

import { useSearchParams } from "next/navigation";
import PinCard from "@/src/components/cards/PinCard";
import { SEARCH_PAGE_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import Masonry from "react-masonry-css";
import { breakpointCols } from "@/src/lib/constants";

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

            <Masonry
                breakpointCols={breakpointCols}
                className="masonry-grid"
                columnClassName="masonry-grid-col"
            >                {pins.map((pin) => (
                <PinCard key={pin.id} data={pin} />
            ))}
            </Masonry>

            <div ref={observerRef} className="flex justify-center mt-6">
                {loading && <Loading />}
            </div>
        </div>
    );
}