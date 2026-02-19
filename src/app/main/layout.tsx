import Header from "@/src/components/commons/Header";
import { UserProvider } from "@/src/components/contexts/UserContext";
import { context } from "@/src/helper/context";
import { redirect } from "next/navigation";
import "../globals.css";
import { UserType } from "@/src/types/types";
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
