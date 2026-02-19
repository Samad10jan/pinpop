import Image from "next/image";
import { PinType
 } from "@/src/types/types";
import Link from "next/link";
import SaveBtn from "../buttons/SaveBtn";
import Loading from "../commons/Loading";

export default function PinCard({ data }: { data: PinType
 }) {
    return (
        <div className="relative border mb-4 group rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all">

            <div className="relative w-full">

                <Image
                    src={data.mediaUrl}
                    alt={data.title}
                    width={500}
                    height={800}
                    className="w-full h-auto object-cover"
                    loading="lazy"
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


                <div className="absolute top-3! right-3! *:size-10! opacity-0! group-hover:opacity-100! transition!  ">
                    <SaveBtn pinId={data.id} isSaved={data.isSaved} />
                </div>

            </div>

        </div>

    );
}
