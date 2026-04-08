"use client";

import PinCard from "@/src/components/cards/PinCard";
import Loading from "@/src/components/commons/Loading";
import useInfinitePins from "@/src/components/commons/useInfinitePins";
import { GET_SAVED_PINS_QUERY } from "@/src/lib/gql/queries/queries";
import { PinType } from "@/src/types/types";
import { Masonry } from "masonic";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";


export default function SavedPage() {
    const toast = useToast();
    const { pins, loading,hasNextPage ,observerRef } = useInfinitePins(
        GET_SAVED_PINS_QUERY,
        {},
        "getSavedPins",
        (err) => toast.error("Failed to load saved pins")
    );

    // if (!loading && pins.length === 0)
    //     return <p className="text-center mt-20">Nothing saved yet</p>;
    if (loading && !pins.length) {
        return <Loading />;
    }

    return (
        <main className="relative min-h-screen">
            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />


            <div className="flex flex-col items-center mb-5">
                <div className="text-4xl md:text-5xl font-black ">
                    Saved
                    <span className="italic text-rose-500 ml-4">Pins</span>
                </div>
                <div className="mt-3 flex gap-2">
                    <div className="h-1 w-12 bg-black rounded-full" />
                    <div className="h-1 w-4 bg-(--orange) rounded-full" />
                    <div className="h-1 w-2 bg-(--teal) rounded-full" />
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


            {
                (!loading && pins.length === 0) &&
                <p className="text-center mt-20">Nothing saved yet</p>
            }

          {hasNextPage && <div ref={observerRef} className="h-1" />}

        </main>
    );
}