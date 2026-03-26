"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import { FEED_QUERY } from "@/src/lib/gql/queries/queries";
import { PinType } from "@/src/types/types";
import { Masonry } from "masonic";
import useInfinitePins from "./useInfinitePins";

export default function Feed() {
  const { pins, loading, observerRef, hasNextPage, } = useInfinitePins(
    FEED_QUERY,
    {},
    "getUserFeed"
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
      <h2 className="text-3xl font-bold my-3">Feed</h2>




      <Masonry
        items={pins}
        columnGutter={16}
        columnWidth={236}        // min width per column, masonic auto-calculates count
      //  overscanBy={Infinity}    
          itemKey={(item: PinType) => item.id}     
        render={({ data }:{data:PinType}) => <PinCard data={data} />}
      />




      {/* Invisible trigger */}
      {hasNextPage && <div ref={observerRef} className="h-1" />}
    </>
  );
}