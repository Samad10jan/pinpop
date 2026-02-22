"use client";

import { logoutAction } from "@/src/helper/logout";
import { HeartIcon, HomeIcon, LogOutIcon, PlusCircleIcon, UserIcon, } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
    const pathname = usePathname();

    const linkStyle = (path: string) =>
        `p-2 rounded-xl transition ${pathname === path ? "bg-black text-white" : "hover:bg-white duration-300"}`;

    return (
        <div className=" fixed z-50  bg-amber-100 border-t md:border-t-0 md:border-r-4 bottom-0 md:bottom-auto w-full md:w-16 h-16 md:h-screen flex md:flex-col justify-between items-center md:px-2 py-2 md:py-6 shadow-md md:shadow-none ">

            <div className="flex flex-row md:flex-col flex-1 md:flex-0 md:gap-6 md:justify-around justify-evenly ">
                <Link href="/main" className={linkStyle("/main")}>
                    <HomeIcon />
                </Link>

                <Link href="/main/saved" className={linkStyle("/main/saved")}>
                    <HeartIcon />
                </Link>

                <Link href="/main/pin" className={linkStyle("/main/pin")}>
                    <PlusCircleIcon />
                </Link>

                 <Link
                    href="/main/current-profile"
                    className={linkStyle("/main/current-profile")}
                >
                    <UserIcon />
                </Link>

                <button
                    title="logout"
                    className="p-2 rounded-xl hover:bg-red-300 transition"
                    onClick={() => logoutAction()}
                >
                    <LogOutIcon />
                </button>
            </div>


            {/* <div className="flex flex-row md:flex-col gap-8 md:gap-6 items-center justify-around flex-1 md:flex-0">
               
            </div> */}
        </div>
    );
}