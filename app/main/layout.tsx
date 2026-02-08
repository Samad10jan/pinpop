import { context } from "@/utils/helper/context";
import "../globals.css";
import { UserType } from "@/types/types";
import { redirect } from "next/navigation";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const {user} = await context()
    console.log(user?.id);
    if (!user?.id) {
       redirect(("/"))
    }
    return (
        <div>

            {children}

        </div>

    );
}
