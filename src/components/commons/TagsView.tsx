import Link from "next/link";

const tags=
     [
        {
          "name": "3d-design",
          "id": "6990849e7c1019d092558d4c"
        },
        {
          "name": "abstract",
          "id": "6990849e7c1019d092558d2e"
        },
        {
          "name": "accessories",
          "id": "6990849e7c1019d092558d35"
        },
        {
          "name": "aesthetic",
          "id": "6990849e7c1019d092558d2c"
        },
        {
          "name": "anime",
          "id": "6990849e7c1019d092558d45"
        },
        {
          "name": "architecture",
          "id": "6990849e7c1019d092558d4a"
        },
        {
          "name": "art",
          "id": "6990849e7c1019d092558d26"
        },
        {
          "name": "backgrounds",
          "id": "6990849e7c1019d092558d6f"
        },
       
        {
          "name": "branding",
          "id": "6990849e7c1019d092558d5a"
        },
       
        {
          "name": "cars",
          "id": "6990849e7c1019d092558d52"
        },
        {
          "name": "cats",
          "id": "6990849e7c1019d092558d5e"
        },
        {
          "name": "coding",
          "id": "6990849e7c1019d092558d43"
        },
        {
          "name": "craft",
          "id": "6990849e7c1019d092558d6c"
        },
        {
          "name": "creative",
          "id": "6990849e7c1019d092558d57"
        },
        {
          "name": "digital-art",
          "id": "6990849e7c1019d092558d28"
        },
        {
          "name": "diy",
          "id": "6990849e7c1019d092558d6d"
        },
        {
          "name": "dogs",
          "id": "6990849e7c1019d092558d5d"
        },
        {
          "name": "education",
          "id": "6990849e7c1019d092558d65"
        },
        {
          "name": "entrepreneur",
          "id": "6990849e7c1019d092558d6b"
        },
        {
          "name": "esports",
          "id": "6990849e7c1019d092558d48"
        },
  
        {
          "name": "funny",
          "id": "6990849e7c1019d092558d56"
        },
        {
          "name": "gaming",
          "id": "6990849e7c1019d092558d47"
        },
        {
          "name": "guitar",
          "id": "6990849e7c1019d092558d63"
        },
        {
          "name": "gym",
          "id": "6990849e7c1019d092558d3a"
        },
        {
          "name": "hairstyle",
          "id": "6990849e7c1019d092558d60"
        },
        {
          "name": "home-decor",
          "id": "698b5237ca361aed3ee1a966"
        },
        {
          "name": "illustration",
          "id": "6990849e7c1019d092558d27"
        },
       
      ]

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
    return (
        <div className="my-5 p-5 flex flex-wrap gap-3 justify-center">
            {tags.slice(0, 20).map((t,i) => (
                <Link
                    key={t.id}
                    href={`/main/tag/${t.id}`}
                    className={`btn-rect text-sm! rounded-full! capitalize! px-4! py-2!  ${colors[i % colors.length]}`}
                >
                    {t.name}
                </Link>
            ))}
        </div>
    );
}