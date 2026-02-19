"use client";

import { SUGG_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
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
                    title="search button"
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3! py-1! btn-circle bg-red-600! text-white rounded-full! text-sm! font-semibold! transition-all! duration-300!"
                >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
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
