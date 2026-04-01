"use client";

import { tags } from "@/src/lib/constants";
import Link from "next/link";

const colors = [
  "bg-yellow-300!",
  "bg-sky-400! text-white!",
  "bg-rose-400! text-white!",
  "bg-violet-400! text-white!",
  "bg-emerald-300!",
  "bg-orange-300!",
  "bg-pink-300!",
  "bg-lime-300!",
];

export default function Tags() {
  const sliced = tags.slice(0, 20);

  return (
    <div className="my-4 bg-neutral-100 px-2 py-4 rounded-lg">
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500">
          Tags
        </h2>

        <Link
          href="/main/tags"
          className="text-xs text-neutral-400 hover:text-neutral-700"
        >
          Browse all →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {sliced.map((t, i) => (
          <Link
            key={t.id}
            href={`/main/tags/${t.id}`}
            className={`btn-rect rounded-full! text-xs! font-medium! capitalize! border! px-3! py-1.5!
            ${i >= 6 ? "hidden sm:inline-flex" : ""}
            ${i >= 10 ? "sm:hidden md:inline-flex" : ""}
            ${colors[i % colors.length]}`}
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}