"use client";

import Tags from "@/src/components/commons/TagsView";
import { featuredCategories, tags } from "@/src/lib/constants";
import Image from "next/image";
import Link from "next/link";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function ExplorePage() {

  const hasLetter = (letter: string) =>
    tags.some((t) => t.name[0].toUpperCase() === letter);

  return (
    <div className="mx-auto max-w-7xl px-4 scroll-smooth mt-2">

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-6xl font-black tracking-tight">
          Explore
          <span className="italic text-rose-500 ml-3">Category</span>
        </h1>

        <div className="mt-3 flex justify-center gap-2">
          <div className="h-1 w-12 bg-black rounded-full" />
          <div className="h-1 w-4 bg-(--orange) rounded-full" />
          <div className="h-1 w-2 bg-(--teal) rounded-full" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-32 md:h-44 rounded-2xl overflow-hidden mb-10">

        <Image
          src="/image2.jpeg"
          alt="Explore categories"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-black/10" />

        <div className="absolute bottom-4 left-6 text-white text-2xl md:text-3xl font-extrabold">
          Discover Creative Ideas
        </div>

      </div>
      {/* TagView */}
      <Tags />

      {/* Featured Category */}
      <div className="mt-14 space-y-12">

        {featuredCategories.map((cat) => (

          <div key={cat.name}>

            <div className="flex items-center justify-between mb-4">

              <div className="flex flex-col">

                <span className={`text-sm font-semibold ${cat.accent}`}>
                  {cat.label}
                </span>

                <h2 className="text-xl font-bold">
                  {cat.name}
                </h2>

              </div>

              <Link
                href={`/main/tags/${cat.id}`}
                className="text-sm font-medium hover:text-rose-500 transition"
              >
                View More
              </Link>

            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">

              {cat.images.map((img, i) => (

                <div
                  key={i}
                  className="relative aspect-4/3 overflow-hidden rounded-lg group"
                >

                  <Image
                    src={img}
                    alt={`${cat.name} preview ${i}`}
                    fill
                    sizes="(max-width:640px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

      {/* Alphabet Navigation */}
      <div className="mt-20">

        <h2 className="text-2xl font-bold mb-6">
          All Categories
        </h2>


        <div className="sticky top-11 z-40 bg-white/80 backdrop-blur-md py-3 mb-10 border-b pl-4">

          <div className="flex flex-wrap gap-3 max-w-7xl mx-auto">

            {alphabet.map((letter) => {

              const available = hasLetter(letter);

              return available ? (

                <Link
                  key={letter}
                  href={`#${letter}`}
                  className="text-xl font-semibold hover:text-rose-500 transition"
                >
                  {letter}
                </Link>

              ) : (

                <span
                  key={letter}
                  className="text-xl font-semibold opacity-30 pointer-events-none"
                >
                  {letter}
                </span>

              );

            })}

          </div>

        </div>

        {/* Category List Alphabet ordered */}
        <div className="space-y-8">

          {alphabet.map((letter) => {

            const filtered = tags.filter(
              (t) => t.name[0].toUpperCase() === letter
            );

            if (!filtered.length) return null;

            return (

              <div key={letter} id={letter} className="scroll-mt-28">

                <h3 className="font-extrabold text-3xl mb-3">
                  {letter}
                </h3>

                <div className="flex flex-wrap gap-3">

                  {filtered.map((t) => (

                    <Link
                      key={t.id}
                      href={`/main/tags/${t.id}`}
                      className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 hover:scale-105 transition text-sm capitalize"
                    >
                      {t.name}
                    </Link>

                  ))}

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}