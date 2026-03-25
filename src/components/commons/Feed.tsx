"use client";

import Masonry from "react-masonry-css";
import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import { FEED_QUERY } from "@/src/lib/gql/queries/queries";
import useInfinitePins from "./useInfinitePins";
import { breakpointCols } from "@/src/lib/constants";

export default function Feed() {
  const { pins, loading, observerRef } = useInfinitePins(
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
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-grid-col"
      >
        {pins.map((pin) => (
          <PinCard key={pin.id} data={pin} />
        ))}
      </Masonry>
      {/* Loader (separate)
     

      {/* Invisible trigger */}
      <div ref={observerRef} className="h-1" />
    </>
  );
}