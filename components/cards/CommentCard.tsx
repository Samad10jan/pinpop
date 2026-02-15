import Image from "next/image";
import { CommentType } from "@/types/types";
import Link from "next/link";

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

    console.log(commentData.id);
    const isOwner = currentUserId === commentData.user.id;

    return (
        <div className="flex gap-4 py-3 group">
            <Link href={`/main/profile/${commentData.user.id}`}>
                <div className="shrink-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-gray-200 transition-all duration-200">
                        <Image
                            src={commentData?.user?.avatar || "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3"}
                            alt={commentData.user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </Link>


            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">
                        {commentData.user.name}
                    </p>
                    <span className="text-xs text-gray-400">
                        {new Date(commentData.createdAt).toLocaleDateString()
                        }
                    </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                    {commentData.content}
                </p>


            </div>

            {isOwner &&
                <button title="delete" disabled={loading} onClick={() => { handleDelete(commentData.id) }} className="btn-circle relative group overflow-hidden! ">
                    
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    
                    <div className="absolute inset-0 w-2 h-full  bg-red-400 transform -translate-x-30 group-hover:translate-x-30 skew-x-12 transition-transform duration-2500" />
                </button>
            }
        </div>
    );
}

