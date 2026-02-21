"use client"

import { logoutAction } from "@/src/helper/logout";
import { HeartIcon, HomeIcon, LogOutIcon, PlusCircleIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
    const pathname = usePathname();

    const linkStyle = (path: string) =>
        `p-2 rounded-xl transition cursor-pointer ${
            pathname === path ? "bg-black text-white transition-all" : "hover:bg-white transition-all duration-300 "
        }`;

    return (
        <div className="border-r-4 fixed z-99 h-screen w-15 flex justify-between flex-col px-2 py-6  bg-amber-100">
            
            {/* upper */}
            <div className="flex flex-col gap-6 items-center">
                <Link href="/main" className={linkStyle("/")}>
                    <HomeIcon />
                </Link>

                <Link href="/main/saved" className={linkStyle("/main/saved")}>
                    <HeartIcon />
                </Link>

                <Link href="/main/pin" className={linkStyle("/main/pin")}>
                    <PlusCircleIcon />
                </Link>
            </div>

            {/* lower */}
            <div className="flex flex-col gap-6 items-center">
                <Link href="/main/current-profile" className={linkStyle("/main/current-profile")}>
                    <UserIcon />
                </Link>

                <button title="logout" className="p-2 rounded-xl hover:bg-red-300 transition " onClick={() => logoutAction()}>
                    <LogOutIcon />
                </button>
            </div>
        </div>
    );
}