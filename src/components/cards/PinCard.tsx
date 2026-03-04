import Image from "next/image";
import {
    PinType
} from "@/src/types/types";
import Link from "next/link";
import SaveBtn from "../buttons/SaveBtn";
import Loading from "../commons/Loading";

export default function PinCard({ data }: { data: PinType }) {

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
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 transition-all duration-300">
                        <div className="absolute top-1 p-3 w-full">
                            <p className="font-semibold text-sm text-white line-clamp-2">
                                {data.title}
                            </p>

                        </div>

                    </div>
                </Link>


                <div className=" absolute m-2 bottom-4 opacity-0! flex gap-1 items-center group-hover:opacity-100! transition!">
                    <div className=" absolute flex border border-orange-300 rounded-full size-8! overflow-hidden  bg-white ">
                        <Image src={data.user.avatar || "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3"} alt={data.user.name} fill className=" object-cover" />
                    </div>
                    <div className=" absolute left-10 text-xs font-semibold text-white">{data.user.name.split(" ")[0]}</div>
                </div>





                <div className="absolute top-3! right-3! *:size-10! opacity-0! group-hover:opacity-100! transition!  ">
                    <SaveBtn pinId={data.id} isSaved={data.isSaved} />
                </div>

            </div>

        </div>

    );
}
