"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import { FEED_QUERY } from "@/src/lib/gql/queries/queries";
import useInfinitePins from "./useInfinitePins";

export default function Feed() {

  const { pins, loading, observerRef } = useInfinitePins(
    FEED_QUERY,
    {},
    "getUserFeed"
  );

  // Initial loading
  if (loading && pins.length === 0) {
    return <Loading />;
  }

  // Empty feed
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

      <div className="columns-2 md:columns-4 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {pins.map((pin) => (
          <PinCard key={pin.id} data={pin} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="flex justify-center mt-6">
        {loading && <Loading />}
      </div>
    </>
  );
}