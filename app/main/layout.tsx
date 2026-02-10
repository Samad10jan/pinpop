import { context } from "@/utils/helper/context";
import "../globals.css";
import { UserType } from "@/types/types";
import { redirect } from "next/navigation";
import { UserProvider } from "@/components/contexts/UserContext";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await context()
    // console.log(user);
    if (!user?.id) {
        redirect(("/"))
    }
    return (
        <div>
            <UserProvider user={user}>


                {children}
            </UserProvider>

        </div>

    );
}
