"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { SEARCH_PAGE_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import { PinType } from "@/src/types/types";
import { Masonry } from "masonic";
import { useSearchParams } from "next/navigation";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const toast = useToast();

    const { pins, loading, hasNextPage, observerRef } = useInfinitePins(
        SEARCH_PAGE_PINS_QUERY,
        { search: q },
        "getSearchPagePins",
        (err) => toast.error("Failed to load search results")
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
            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
            <h2 className="text-xl font-bold mb-4">
                Results for "{q}"
            </h2>

            <div className="hidden sm:flex md:flex w-full">
                <Masonry
                    items={pins}
                    columnGutter={16}
                    columnWidth={236}        // min width per column, masonic auto-calculates count
                    //  overscanBy={Infinity}    
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
        </div>
    );
}