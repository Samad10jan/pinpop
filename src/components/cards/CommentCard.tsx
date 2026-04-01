import Image from "next/image";
import { CommentType } from "@/src/types/types";
import Link from "next/link";
import { TrashIcon } from "lucide-react";

export default function CommentCard({
    commentData,
    handleDelete,
    loading,
    currentUserId
}: {
    commentData: CommentType,
    handleDelete: (id: string) => void,
    loading: boolean,
    currentUserId: string
}) {

    // console.log(commentData.id);
    const isOwner = currentUserId === commentData.user.id;

    return (
        <div className="flex gap-4 py-3 group fade-up ring-2 ring-gray-500 px-3 rounded-xl transition-all duration-500">
            <Link href={`/main/profile/${commentData.user.id}`}>
                <div className="shrink-0">
                    <div className=" bg-green-300 flex justify-center items-center relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 transition-all duration-200">
                        {commentData.user.avatar
                            ?
                            <Image
                                src={commentData?.user?.avatar }
                                alt={commentData.user.name}
                                fill
                                className="object-cover"
                            /> :
                            <div className=" capitalize ">{commentData.user.name[0]}</div>
                        }
                    </div>
                </div>
            </Link>


            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">
                        {commentData.user.name}
                    </p>
                    <span className="text-xs text-gray-400">
                        {
                            new Date(commentData.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                            }
                            )}
                    </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                    {commentData.content}
                </p>


            </div>

            {isOwner &&
                <button title="delete" disabled={loading} onClick={() => { handleDelete(commentData.id) }} className="btn-circle bg-red-400 size-10! relative group overflow-hidden! ">

                    <TrashIcon />
                    <div className="absolute inset-0 w-2 h-full  bg-red-400 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />
                </button>
            }
        </div>
    );
}

