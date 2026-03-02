"use client";

import FollowBtn from "@/src/components/buttons/FollowBtn";
import { UserContext } from "@/src/components/contexts/UserContext";
import { PROFILE_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { UserType } from "@/src/types/types";
import { getGraphQLError } from "@/src/helper/ApiError";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function UserPage() {

  const params = useParams();
  const userId = params?.userId as string;

  const [user, setUser] = useState<UserType>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [lastUploadedPins, setLastUploadedPins] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const context = useContext(UserContext);
  const currentUser = context?.currentUser;
  // const [error, setError] = useState("")

  if (userId === currentUser?.id) redirect("/main/current-profile")

  useEffect(() => {
    if (!userId) return;

    async function getData() {
      try {

        const data = await gqlClient.request(PROFILE_QUERY, {
          userId,
        });

        const p = data?.getProfile;

        if (!p) return;


        setUser(p.user);
        setFollowersCount(p.followersCount || 0);
        setFollowingCount(p.followingCount || 0);
        setTotalLikes(p.totalLikes || 0);
        setIsFollowing(p.isFollowing);
        setLastUploadedPins(p.lastUploadedPins || []);

      } catch (err: any) {
        console.error("GraphQL error:", getGraphQLError(err));

        // setError(getGraphQLError(err))
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [userId]);

  // console.log("asasasda", error);


  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-cyan-600 text-white">
            <p className="text-xl font-bold">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page">
        <div className="container">
          <div className="card max-w-md mx-auto mt-20 text-center bg-red-500 text-white">
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
          </div>
        </div>
      </main>
    );
  }

  const name = user?.name || "Anonymous";
  const email = user?.email || "No email";
  const avatar =
    user?.avatar ||
    "https://tse1.mm.bing.net/th/id/OIP.2ZC6eH3utWfNn6yZaCEstgHaFf?w=5263&h=3903&rs=1&pid=ImgDetMain&o=7&rm=3";

  const totalPins = user?.uploadCount || 0;

  // optimistic update
  const handleFollowChange = (val: boolean) => {
    setIsFollowing(val);
    setFollowersCount(prev => (val ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <main className="page">
      <div className="container py-8">
        <div className="my-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">Profile View</h1>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-black rounded-full" />
            <div className="h-1 w-4 bg-(--orange) rounded-full" />
            <div className="h-1 w-2 bg-(--teal) rounded-full" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="card sticky top-8 bg-white">
              <div className="flex justify-center mb-6 ">
                <div className=" relative w-32! h-32! btn-circle overflow-hidden! ">
                  <div className=" absolute w-full h-full ">
                    <Image
                      src={avatar}
                      alt={`${name}'s avatar`}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1">{name}</h2>
                <p className="text-sm opacity-70 mb-4">{email}</p>

                {
                  currentUser?.id !== user?.id &&
                  <FollowBtn targetUserId={user.id} initiallyFollowing={isFollowing} onFollowChange={handleFollowChange} />
                }
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg mb-4 bg-[#F0E7D6] border-2 border-black">
                <div className="text-center">
                  <div className="text-2xl font-bold">{followersCount}</div>
                  <div className="text-xs opacity-70">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{followingCount}</div>
                  <div className="text-xs opacity-70">Following</div>
                </div>
              </div>
            </div>

            {/* {
              error && <p className="text-red-600 font-extrabold underline">{error}</p>
            } */}

          </div>

          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="card text-center btn-rect bg-orange-500! text-white">
                <div className="text-3xl font-bold">{totalPins}</div>
                <div className="text-sm mt-1">Total Pins</div>
              </div>

              <div className="card text-center btn-rect bg-purple-600! text-white">
                <div className="text-3xl font-bold">{totalLikes}</div>
                <div className="text-sm mt-1">Likes</div>
              </div>
            </div>

            <div className="card mb-6 bg-white">
              <h3 className="text-xl font-bold mb-4 capitalize">{name}'s Pins</h3>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {lastUploadedPins.map(u => (
                  <div key={u.id} className="relative max-w-50 h-20 mb-4 group rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                    <div className=" absolute w-full h-full">
                      <Image
                        src={u.mediaUrl}
                        alt={u.title}
                        fill
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />

                      <Link href={`/main/pin/${u.id}`}>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40">
                          <div className="absolute bottom-0 p-3 w-full">
                            <p className="font-semibold text-sm text-white line-clamp-2">
                              {u.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <Link href={`/main/uploads/${user.id}`} className="btn-rect w-full text-center block capitalize">
                View All {name.split(" ")[0]}'s Pins
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
