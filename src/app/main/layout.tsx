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
      <UserProvider user={user as UserType}>
        <div>
          <SideBar />


          <div className="md:ml-16 mb-16 md:mb-0 ">
            <Header />
            <div className="mx-auto md:p-10 p-5 ">

              {children}
            </div>
          </div>
        </div>
      </UserProvider>
    </div>

  );
}
