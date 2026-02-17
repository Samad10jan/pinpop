import Header from "@/components/commons/Header";
import { UserProvider } from "@/components/contexts/UserContext";
import { context } from "@/utils/helper/context";
import { redirect } from "next/navigation";
import "../globals.css";
import { UserType } from "@/types/types";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await context()
    return (
        <div>
            <UserProvider user={user}>
                <Header />

                {children}
            </UserProvider>

        </div>

    );
}
