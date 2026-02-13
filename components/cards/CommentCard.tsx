import Image from "next/image";
import { CommentType } from "@/types/types";

export default function CommentCard({
    commentData,
}: {
    commentData: CommentType;
}) {
    return (
        <div className="flex gap-4 py-3 group">
         
            <div className="shrink-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-gray-200 transition-all duration-200">
                    <Image
                        src={commentData?.user?.avatar||"https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3"}
                        alt={commentData.user.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

          
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
        </div>
    );
}

