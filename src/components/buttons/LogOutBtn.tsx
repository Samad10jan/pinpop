"use client";

import { useRouter } from "next/navigation";
import { gql } from "graphql-request";
import gqlClient from "@/src/lib/services/graphql";
import { LOGOUT } from "@/src/lib/gql/mutations/mutations";
import { LogOutIcon } from "lucide-react";


export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await gqlClient.request(LOGOUT);
            router.replace("/");
            router.refresh();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <button
        title="logout button"
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-300 transition"
        >
              <LogOutIcon />
        </button>
    );
}