"use client"
import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import { tags } from "@/src/lib/constants";
import { GET_PINS_BY_TAG_QUERY, GET_SAVED_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { PinType } from "@/src/types/types";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { tagId } = useParams()
    const [pins, setPins] = useState<PinType[]>([]);
    const [loading, setLoading] = useState(true);
    const [tagName, setTagName] = useState("Tag");

    useEffect(() => {
        function getTagName(tagId: String) {
            const tag = tags.filter((t) => tagId === t.id)
            return tag[0].name
        }
        setTagName(getTagName(tagId as string))
    }, [tagId])

    useEffect(() => {
        async function getFeed() {
            try {
                const res = await gqlClient.request(GET_PINS_BY_TAG_QUERY, {
                    tagId: tagId
                });
                console.log(res);

                setPins(res?.getPinsByTag.pins || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        getFeed();
    }, []);



    if (!loading && pins.length === 0)
        return (
            <div className="relative flex flex-col items-center justify-center min-h-[60vh] overflow-hidden">

                <div className="card text-center px-12 py-10 bg-white">
                    <p className="text-2xl  font-black tracking-tight">No Pin For <span className=" capitalize text-rose-500">{tagName}</span> Yet </p>
                </div>
                <Link href={"/main/pin"} className="btn-rect mt-3 flex flex-col justify-center items-center">Be First!! <PlusCircleIcon /> </Link>
            </div>
        );

    return (
        <main className="relative min-h-screen px-6 py-12 overflow-hidden">

            <div className="relative text-center mx-auto mb-14">

                <div className=" text-4xl md:text-6xl capitalize font-black tracking-tighter wrap-break-word">
                    {tagName}
                    <span className="italic text-rose-500 ml-4">Pins</span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-1 w-12 bg-black rounded-full" />
                    <div className="h-1 w-4 bg-(--orange) rounded-full" />
                    <div className="h-1 w-2 bg-(--teal) rounded-full" />
                </div>
            </div>

            {loading ? <Loading /> : (
                <div className="max-w-screen-2xl mx-auto">
                    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
                        {pins.map((pin) => (
                            <div key={pin.id}>
                                <PinCard data={pin} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}