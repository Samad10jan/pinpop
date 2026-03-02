"use client";

import { useEffect, useState } from "react";
import PinCard from "@/src/components/cards/PinCard";
import gqlClient from "@/src/lib/services/graphql";
import Loading from "@/src/components/commons/Loading";
import { FEED_QUERY } from "@/src/lib/gql/queries/queries";
import { PinType } from "@/src/types/types";
import HeroSection from "@/src/components/commons/HeroSection";
import Tags from "@/src/components/commons/TagsView";


export default function Home() {
  const [pins, setPins] = useState<PinType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFeed() {
      try {
        const res = await gqlClient.request(FEED_QUERY, {
          limit: 10,
          page: 1,
        });

        setPins(res?.getUserFeed.pins || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getFeed();
  }, []);

  if (loading) {
    return (
      <main className="page px-5 py-8">
        <Loading />
      </main>
    );
  }

  return (
    <main className="page px-5 py-8">

      {!pins.length && (
        <p className="text-center opacity-60 mt-20">
          No pins yet
        </p>
      )}
      <HeroSection/>

<Tags/>
      <div className="columns-2 md:columns-4 lg:columns-4 xl:columns-5 gap-4 space-y-4">

        {pins.map((pin) => (

          <PinCard data={pin} key={pin.id} />

        ))}

      </div>
    </main>
  );
}
