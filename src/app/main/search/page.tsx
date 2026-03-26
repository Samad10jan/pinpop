"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { SEARCH_PAGE_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import { Masonry } from "masonic";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    const { pins, loading,hasNextPage, observerRef } = useInfinitePins(
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
                items={pins}
                columnGutter={16}
                columnWidth={236}
                 overscanBy={1} 
                itemKey={(item) => item.id}
                render={({ data }) => <PinCard data={data} />}
            />

            {hasNextPage && <div ref={observerRef} className="h-1" />}
        </div>
    );
}