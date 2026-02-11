import { context } from "@/utils/helper/context";
import "../globals.css";
import { UserType } from "@/types/types";
import { redirect } from "next/navigation";
import { UserProvider } from "@/components/contexts/UserContext";
import Header from "@/components/commons/Header";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await context()
    console.log("asasas", user);
    if (!user?.id) {
        redirect(("/"))
    }
    return (
        <div>
            <UserProvider user={user}>
                <Header />

                {children}
            </UserProvider>

        </div>

    );
}
