import GotoTopBtn from "@/src/components/buttons/GotoTopBtn";
import Header from "@/src/components/commons/Header";
import SideBar from "@/src/components/commons/SideBar";
import { UserProvider } from "@/src/components/contexts/UserContext";
import { context } from "@/src/helper/context";
import { UserType } from "@/src/types/types";
import "../globals.css";
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
              <GotoTopBtn />
            </div>
          </div>
        </div>
      </UserProvider>
    </div>

  );
}
