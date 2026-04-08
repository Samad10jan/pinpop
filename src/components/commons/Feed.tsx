"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import { FEED_QUERY } from "@/src/lib/gql/queries/queries";
import { PinType } from "@/src/types/types";
import { Masonry } from "masonic";
import useInfinitePins from "./useInfinitePins";
import { useToast } from "./Toast";

export default function Feed() {
  const toast = useToast();
  const { pins, loading, observerRef, hasNextPage, } = useInfinitePins(
    FEED_QUERY,
    {},
    "getUserFeed",
    (err) => toast.error("Failed to load feed")
  );

  if (loading && pins.length === 0) return <Loading />;

  if (!loading && pins.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-lg font-medium">
        No Feed For You
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold my-3">Top Pins</h2>

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


      {/* Invisible trigger */}
      {hasNextPage && <div ref={observerRef} className="h-1" />}
    </>
  );
}