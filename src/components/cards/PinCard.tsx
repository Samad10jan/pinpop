"use client";

import { useState, useEffect } from "react";
import { PinType } from "@/src/types/types";
import Image from "next/image";
import Link from "next/link";
import SaveBtn from "../buttons/SaveBtn";

const loadedImages = new Set<string>(); // tracks images already loaded, Set for O(1) lookups

export default function PinCard({ data }: { data: PinType }) {
  const [isLoaded, setIsLoaded] = useState(loadedImages.has(data.mediaUrl));

  useEffect(() => {
    if (isLoaded) loadedImages.add(data.mediaUrl);
  }, [isLoaded, data.mediaUrl]);

  return (
    <div className="relative break-inside-avoid mb-4 group rounded-2xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-500">

      <div className="relative w-full">

        {/* Skeleton overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl z-10" />
        )}

        <Image
          src={data.mediaUrl}
          alt={data.title}
          width={500}
          height={800}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover rounded-2xl transition-all duration-700 ease-in-out
            ${isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"}
          `}
        />

        <Link href={`/main/pin/${data.id}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300 rounded-2xl">
            <div className="absolute top-1 p-3 w-full">
              <p className="font-semibold text-sm text-white line-clamp-2">
                {data.title}
              </p>
            </div>
          </div>
        </Link>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <SaveBtn pinId={data.id} isSaved={data.isSaved} />
        </div>

      </div>
    </div>
  );
}

// Masonry wrapper
// export const MasonryCard = ({ data }: { data: PinType }) => <PinCard data={data} />;