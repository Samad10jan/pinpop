'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PinCard from "@/src/components/cards/PinCard";
import { SEARCH_PAGE_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { PinType
 } from "@/src/types/types";
import Loading from '@/src/components/commons/Loading';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    const [pins, setPins] = useState<PinType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPins = async () => {
            if (!q) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await gqlClient.request(SEARCH_PAGE_PINS_QUERY, {
                    search: q,
                });

                setPins(res?.getSearchPagePins.pins || []);
            } catch (err) {
                console.error('Error fetching pins:', err);
                setError('Failed to load search results');
            } finally {
                setLoading(false);
            }
        };

        fetchPins();
    }, [q]);

    if (!q) {
        return <div className="text-center mt-20">No search query</div>;
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!pins.length) {
        return (
            <p className="text-center opacity-60 mt-20">
                No pins found for "{q}"
            </p>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                Results for "{q}"
            </h2>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {pins.map((pin: PinType
) => (
                    <PinCard data={pin} key={pin.id} />
                ))}
            </div>
        </div>
    );
}