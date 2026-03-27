import { HouseIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FEF6F0] overflow-hidden">

    
      <div className="absolute top-6 left-8 text-3xl font-extrabold tracking-wider">
        PINPOP
      </div>

      <div className="relative z-10 bg-white/80 border border-gray-200 shadow-xl rounded-3xl px-12 py-10 text-center max-w-md">

        <h1 className="text-6xl font-black text-[#FE7F2D] mb-2">
          404
        </h1>

        <p className="text-xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </p>

        <p className="text-gray-500 mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          href="/main"
          className=" btn-rect inline-flex items-center gap-2 bg-[#FE7F2D] text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition-all"
        >
          <HouseIcon size={18} />
         
        </Link>
      </div>
    </div>
  );
}