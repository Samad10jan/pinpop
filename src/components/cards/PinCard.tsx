"use client";

import { useState } from "react";
import { PinType } from "@/src/types/types";
import Image from "next/image";
import Link from "next/link";
import SaveBtn from "../buttons/SaveBtn";

export default function PinCard({ data }: { data: PinType }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative break-inside-avoid mb-4 group rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all">

      <div className="relative w-full">

        {/* Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-300" />
        )}

        <Image
          src={data.mediaUrl}
          alt={data.title}
          width={500}
          height={800}
          loading="lazy"
          onLoadingComplete={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-500 ${
            isLoaded
              ? "opacity-100 blur-0 scale-100"
              : "opacity-0 blur-md scale-105"
          }`}
        />

        <Link href={`/main/pin/${data.id}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 transition-all duration-300">
            <div className="absolute top-1 p-3 w-full">
              <p className="font-semibold text-sm text-white line-clamp-2">
                {data.title}
              </p>
            </div>
          </div>
        </Link>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
          <SaveBtn pinId={data.id} isSaved={data.isSaved} />
        </div>

      </div>

    </div>
  );
}