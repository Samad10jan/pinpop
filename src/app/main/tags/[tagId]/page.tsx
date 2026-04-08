"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { tags } from "@/src/lib/constants";
import { GET_PINS_BY_TAG_QUERY } from "@/src/lib/gql/queries/queries";
import { PinType } from "@/src/types/types";
import { PlusCircleIcon } from "lucide-react";
import { Masonry } from "masonic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";

export default function Home() {
    const { tagId } = useParams();
    const toast = useToast();

    const [tagName, setTagName] = useState("Tag");

    const { pins, loading, hasNextPage, observerRef } = useInfinitePins(
        GET_PINS_BY_TAG_QUERY,
        { tagId },
        "getPinsByTag",
        (err) => toast.error("Failed to load tag pins")
    );
    console.log(hasNextPage);

    useEffect(() => {
        function getTagName(id: string) {
            const tag = tags.find((t) => t.id === id);
            return tag?.name || "Tag";
        }

        if (tagId) setTagName(getTagName(tagId as string));
    }, [tagId]);

    if (loading && !pins.length) {
        return <Loading />;
    }
    if (!loading && pins.length === 0)
        return (
            <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
                <div className="card text-center px-12 py-10 bg-white">
                    <p className="text-2xl font-black tracking-tight">
                        No Pin For{" "}
                        <span className="capitalize text-rose-500">{tagName}</span> Yet
                    </p>
                </div>

                <Link
                    href={"/main/pin"}
                    className="btn-rect mt-3 flex flex-col justify-center items-center"
                >
                    Be First!! <PlusCircleIcon />
                </Link>
            </div>
        );

    return (
        <main className="relative min-h-screen">
            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

            <div className="text-center mx-auto mb-14">
                <div className="text-4xl md:text-6xl capitalize font-black tracking-tighter">
                    {tagName}
                    <span className="italic text-rose-500 ml-4">Pins</span>
                </div>
            </div>


            <div className="hidden sm:flex md:flex w-full">
                <Masonry
                    items={pins}
                    columnGutter={16}
                    columnWidth={236}        // min width per column, masonic auto-calculates count   
                    itemKey={(item: PinType) => item.id}
                    render={({ data }: { data: PinType }) => <PinCard data={data} />}
                />

            </div>

            <div className="flex sm:hidden md:hidden w-full">
                <Masonry
                    items={pins}
                    columnGutter={16}
                    columnWidth={110}        // min width per column, masonic auto-calculates count 
                    itemKey={(item: PinType) => item.id}
                    render={({ data }: { data: PinType }) => <PinCard data={data} />}
                />

            </div>


            {hasNextPage && <div ref={observerRef} className="h-1" />}



        </main>
    );
}