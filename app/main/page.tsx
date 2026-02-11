"use client";

import { useEffect, useState } from "react";
import PinCard from "@/components/cards/PinCard";
import gqlClient from "@/lib/services/graphql";
import Loading from "@/components/commons/Loading";

const FEED_QUERY = `
query ($limit: Int, $page: Int) {
  getUserFeed(limit: $limit, page: $page) {
    id
    mediaUrl
    fileType
    tagIds
    title
    createdAt
    user {
      id
      name
      avatar
    }
  }
}
`;

export default function Home() {
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFeed() {
      try {
        const res = await gqlClient.request(FEED_QUERY, {
          limit: 10,
          page: 1,
        });

        setPins(res?.getUserFeed || []);
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


      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">

        {pins.map((pin) => (

          <PinCard data={pin} key={pin.id} />

        ))}

      </div>
    </main>
  );
}
