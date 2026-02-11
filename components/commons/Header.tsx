"use client";

import { SUGG_QUERY } from "@/lib/gql/queries/queries";
import gqlClient from "@/lib/services/graphql";
import { useEffect, useState } from "react";

export default function Header() {
    const [sugg, setSugg] = useState<string[]>([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [focus, setFocus] = useState(false);

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
    };




    return (
        <div className="relative px-5 pt-2">
            <form action="/main/search" className="relative duration-300 transition-all!">
                <input
                    name="q"
                    type="search"
                    placeholder="Search"
                    value={q}
                    autoComplete="off"
                    className="card bg-amber-100 rounded-full px-4 font-bold focus:ring-2 placeholder:font-extrabold ring-red-500 py-2 w-full outline-0 focus:bg-white/90 transition-all duration-700"
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setTimeout(() => setFocus(false), 150)}
                    
                />

                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold transition-all! duration-300"
                >
                    Search
                </button>

                {loading && (
                    <span className="absolute right-20 top-1/2 -translate-y-1/2 text-xs transition-all! duration-300">
                        
                    </span>
                )}
            </form>

            {focus && sugg.length > 0 && (
                <div className="absolute top-full px-1 left-5 right-5 bg-white rounded-2xl shadow-lg mt-2 z-50 py-1">
                    {sugg.map((s, i) => (
                        <div
                            key={i}
                            onMouseDown={() => handleSuggestionClick(s)}
                            className="px-5 py-2 hover:bg-gray-200 cursor-pointer rounded-2xl font-bold text-sm transition-all! duration-500"
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
