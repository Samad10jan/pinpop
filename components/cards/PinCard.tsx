import Image from "next/image";
import { FeedPinType } from "@/types/types";
import Link from "next/link";

export default function PinCard({ data }: { data: FeedPinType }) {
    return (
        <div className="relative border mb-4 group rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all">

            <div className="relative w-full">

                <Image
                    src={data.mediaUrl}
                    alt={data.title}
                    width={500}
                    height={800}
                    className="w-full h-auto object-cover"
                />


                <Link href={`/main/pin/${data.id}`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40">
                        <div className="absolute bottom-0 p-3 w-full">
                            <p className="font-semibold text-sm text-white line-clamp-2">
                                {data.title}
                            </p>
                        </div>
                    </div>
                </Link>


                <button className="absolute top-3! right-3! opacity-0! group-hover:opacity-100! transition! btn-rect bg-red-600! text-white px-4! py-1! rounded-full! text-sm! font-semibold!">
                    Save
                </button>

            </div>

        </div>

    );
}
