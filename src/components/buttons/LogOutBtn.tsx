"use client";

import { useRouter } from "next/navigation";
import { gql } from "graphql-request";
import gqlClient from "@/src/lib/services/graphql";
import { LOGOUT } from "@/src/lib/gql/mutations/mutations";
import { LogOutIcon } from "lucide-react";
import { useToast } from "@/src/components/commons/Toast";
import { getGraphQLError } from "@/src/helper/ApiError";


export default function LogoutButton() {
    const router = useRouter();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await gqlClient.request(LOGOUT);
            toast.success("Logged out successfully!");
            router.replace("/");
            router.refresh();
        } catch (err: any) {
            toast.error(getGraphQLError(err) || "Logout failed");
        }
    };

    return (
        <button
        title="logout button"
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-300 transition"
        >
              <LogOutIcon size={20} />
        </button>
    );
}