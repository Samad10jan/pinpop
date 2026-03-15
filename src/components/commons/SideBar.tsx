"use client";
import { Compass, HeartIcon, HomeIcon, PinIcon, PlusCircleIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../buttons/LogOutBtn";

export default function SideBar() {
    const pathname = usePathname();

    const NavLink = ({ href, icon: Icon, label, }: { href: string; icon: any; label: string; }) => {

        const isActive = pathname === href;
        return (
            <Link
                href={href}
                title={label}
                className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 
                    ${isActive
                        ? "bg-rose-400! text-white shadow-[3px_3px_0_rgba(0,0,0,0.15)]"
                        : "hover:bg-white text-black hover:shadow-[3px_3px_0_black] border-2 border-transparent hover:border-black"
                    }`}
            >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

                <span className="hidden md:block absolute left-14 bg-black text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50">
                    {label}
                </span>
            </Link>
        );
    };

    return (
        <div
            className="fixed z-50 bottom-0 md:bottom-auto md:top-0 md:left-0
        w-full md:w-18
        h-16 md:h-screen
        flex md:flex-col items-center
        md:px-3 md:py-6
        border-t-2 md:border-t-0 md:border-r-2 border-black
        shadow-[0_-2px_0_black] md:shadow-[2px_0_0_black]
        bg-(--bg)"

        >

            <div className="hidden *:rotate-45 md:flex mb-8 w-11 h-11 rounded-full bg-black text-white items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,0.3)] shrink-0">
                <PinIcon size={20} />
            </div>


            <nav className="flex flex-row md:flex-col items-center justify-evenly md:justify-start md:gap-3 flex-1 md:flex-none w-full md:w-auto px-4 md:px-0">
                <NavLink href="/main" icon={HomeIcon} label="Home" />
                <NavLink href="/main/tags" icon={Compass} label="Explore"/>
                <NavLink href="/main/saved" icon={HeartIcon} label="Saved" />
                <NavLink href="/main/pin" icon={PlusCircleIcon} label="Add Pin" />
                <NavLink href="/main/current-profile" icon={UserIcon} label="Profile" />




                <div className="md:mt-auto group">
                    <LogoutButton />
                    <span className="hidden md:block absolute left-14 bg-black text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50">
                        LogOut
                    </span>
                </div>
            </nav>
        </div>
    );
}