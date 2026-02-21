import Header from "@/src/components/commons/Header";
import { UserProvider } from "@/src/components/contexts/UserContext";
import { context } from "@/src/helper/context";
import { redirect } from "next/navigation";
import "../globals.css";
import { UserType } from "@/src/types/types";
import SideBar from "@/src/components/commons/SideBar";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await context()
    return (
        <div>
           <UserProvider user={user}>
            <div className="flex">
                <SideBar />

                <div className="flex-1 ml-16">
                    <Header />
                    {children}
                </div>
            </div>
        </UserProvider>

        </div>

    );
}
