"use client";

import { tags } from "@/src/lib/constants";
import Link from "next/link";
import { useState } from "react";

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

const STEP = 3;
const sliced = tags.slice(0, 20);

export default function Tags() {
  const [offset, setOffset] = useState(0);

  return (
    <div className=" my-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500">Tags</h2>
        <div className="flex items-center gap-2">

          <button onClick={() => setOffset((o) => Math.max(0, o - STEP))} disabled={offset === 0} className="w-5 h-5 flex items-center justify-center rounded border border-neutral-200 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-[10px]">‹</button>
          <button onClick={() => setOffset((o) => Math.min(sliced.length - STEP, o + STEP))} disabled={offset + STEP >= sliced.length} className="w-5 h-5 flex items-center justify-center rounded border border-neutral-200 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-[10px]">›</button>
          
          <Link href="/main/tags" className="text-xs text-neutral-400 hover:text-neutral-700">Browse all →</Link>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-2 transition-all duration-700"
          style={{ transform: `translateX(calc(-${offset} * (100% / ${STEP})))` }}
        >
          {sliced.map((t, i) => (
            <Link
              key={t.id}
              href={`/main/tags/${t.id}`}
              className={` btn-rect rounded-full! my-5! shrink-0! text-xs! font-medium! capitalize! border!  px-3! py-1.5! transition-all ${colors[i % colors.length]}`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}