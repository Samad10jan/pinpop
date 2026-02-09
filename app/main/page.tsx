import { context } from "@/utils/helper/context";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const {user} = await context()
  return (
    <main className="page">

      Feed
      <Link href={`http://localhost:3000/main/profile/${user.id}`}>
      <div className="relative w-22 h-22 overflow-hidden btn-circle bg-teal-500">

      <div className="absolute w-full h-full overflow-hidden">
        <Image src={user.avatar||"a"} fill alt="user"/>

      </div>
        
      </div>
      
      </Link>

    </main>
  );
}
