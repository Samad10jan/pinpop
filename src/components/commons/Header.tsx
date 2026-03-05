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
    const [searched, setSearched] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!q.trim()) {
            setSugg([]);
            setLoading(false);
            return;
        }

        let isActive = true;
        setLoading(true);

        const timeout = setTimeout(async () => {
            try {
                const res = await gqlClient.request(SUGG_QUERY, { search: q });

                if (!isActive) return;
                setSugg(res?.getSugg || []);
            } catch {
                if (!isActive) return;
                setSugg([]);
            } finally {
                if (isActive) setLoading(false);
            }
        }, 400);

        return () => {
            isActive = false;
            clearTimeout(timeout);
        };
    }, [q]);

    const handleSuggestionClick = (s: string) => {
        setQ(s);
        setSugg([]);
        router.replace(`/main/search?q=${encodeURIComponent(s)}`);
    };

    const showDropdown = focus && q.trim().length > 0;
    return (
        <div className="px-5 pt-2 sticky z-99 top-0">
            <form action="/main/search" className="relative">
                <input
                    name="q"
                    type="search"
                    placeholder="Search"
                    value={q}
                    autoComplete="off"
                    className="w-full h-11 pl-10 pr-12
                         border-2 border-black
                        rounded-full
                        font-bold text-sm placeholder:text-black/35 placeholder:font-bold
                        outline-none
                        transition-all duration-200
                        bg-(--bg)
                        focus-within:bg-amber-200"
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setTimeout(() => setFocus(false), 150)}
                />

                <SearchIcon
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                />

                <button
                    title="search button"
                    type="submit"
                    disabled={loading}
                    className="absolute right-3! size-8! top-1/9
                        btn-circle bg-red-600! text-white! text-sm! font-semibold! 
                        disabled:opacity-80! transition-all! duration-300!"
                >
                    <SearchIcon size={13} />
                </button>
            </form>

            {showDropdown && (
                <div className="absolute top-full px-1 left-5 right-5 bg-white rounded-2xl shadow-lg mt-2 z-50 py-1">
                    
                    {loading ? (
                        <div className="px-5 py-2 text-sm text-gray-400 font-medium">
                            Loading...
                        </div>
                    ) : sugg.length > 0 ? (
                        sugg.map((s, i) => (
                            <div
                                key={i}
                                onMouseDown={() => handleSuggestionClick(s)}
                                className="px-5 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer rounded-2xl font-bold text-sm transition-colors duration-150"
                            >
                                <span>{s}</span>
                                <SearchIcon size={14} className="text-gray-400" />
                            </div>
                        ))
                    ) : (
                        <p className="px-5 py-2 text-sm text-gray-400 font-medium">
                            No matching pins
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}