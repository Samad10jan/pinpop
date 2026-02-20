"use client";

import { SUGG_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const [sugg, setSugg] = useState<string[]>([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [focus, setFocus] = useState(false);

    const router = useRouter()

    useEffect(() => {

        if (!q.trim()) {
            setSugg([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await gqlClient.request(SUGG_QUERY, { search: q });
                setSugg(res?.getSugg || []);
            } catch {
                setSugg([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [q]);

    const handleSuggestionClick = (s: string) => {
        setQ(s);
        setSugg([]);
        router.replace(`/main/search?q=${s}`)

    };




    return (
        <div className=" relative px-5 pt-2  ">
            <form action="/main/search" className="relative duration-300 transition-all!">
                <input
                    name="q"
                    type="search"
                    placeholder="Search"
                    value={q}
                    autoComplete="off"
                    className="card bg-amber-100 rounded-full px-4 h-5 font-bold focus:ring-2 placeholder:font-extrabold ring-red-500 py-2 w-full outline-0 focus:bg-white/90 transition-all duration-700"
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setTimeout(() => setFocus(false), 150)}

                />

                <button
                    title="search button"
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 size-8! disabled:opacity-80!  top-1/2 -translate-y-1/2 btn-circle bg-red-600! text-white text-sm! font-semibold! transition-all! duration-300!"
                >
                    <SearchIcon size={13}/>
                </button>
            </form>

            {focus && sugg.length > 0 && (
                <div className="absolute top-full px-1 left-5 right-5 bg-white rounded-2xl shadow-lg mt-2 z-50 py-1">
                    {sugg.map((s, i) => (
                        <div
                            key={i}
                            onMouseDown={() => handleSuggestionClick(s)}
                            className="px-5 py-2 flex justify-between hover:bg-gray-200 cursor-pointer rounded-2xl font-bold text-sm transition-all! duration-300"
                        >
                            {s} <SearchIcon/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
