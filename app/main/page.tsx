import PinCard from "@/components/cards/PinCard";
import { context } from "@/utils/helper/context";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { user } = await context()
  return (
    <main className="page px-5">

      Feed
      <Link href={`http://localhost:3000/main/profile/${user?.id}`}>
        <div className="relative w-22 h-22 overflow-hidden btn-circle bg-teal-500">

          <div className="absolute w-full h-full overflow-hidden">
            <Image src={user?.avatar || "a"} fill alt="user" />

          </div>

        </div>

        <PinCard data={{
          id: "1",
          title: "Modern Bedroom Interior Design",
          mediaUrl:
            "https://res.cloudinary.com/dd7cvhpar/image/upload/v1770738311/fixel/pin/upyjepotmoqy9rhptw4t.png",
          fileType: "image",
          tagIds: ["interior", "bedroom", "design"],
          createdAt: new Date(),
        }} />
      </Link>


      


    </main>
  );
}
