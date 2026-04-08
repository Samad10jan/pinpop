"use client";

import FollowBtn from "@/src/components/buttons/FollowBtn";
import { UserContext } from "@/src/components/contexts/UserContext";
import { PROFILE_QUERY } from "@/src/lib/gql/queries/queries";
import gqlClient from "@/src/lib/services/graphql";
import { PinType, UserType } from "@/src/types/types";
import { getGraphQLError } from "@/src/helper/ApiError";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, useToast } from "@/src/components/commons/Toast";
import { ArrowRightIcon } from "lucide-react";

export default function UserPage() {

  const params = useParams();
  const userId = params?.userId as string;

  const [user, setUser] = useState<UserType>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [lastUploadedPins, setLastUploadedPins] = useState<PinType[]>([]);

  const [loading, setLoading] = useState(true);
  const context = useContext(UserContext);
  const currentUser = context?.currentUser;
  const toast = useToast();
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
        toast.error(getGraphQLError(err));

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
            <p className="text-xl font-bold">Loading...</p>
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
  const avatar = user?.avatar
  const totalPins = user?.uploadCount || 0;

  // optimistic update
  const handleFollowChange = (val: boolean) => {
    setIsFollowing(val);
    setFollowersCount(prev => (val ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <main className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto">

  <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

  {/* Header */}
  <div className="mb-10 text-center">
    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">Profile</h1>

    <p className="text-sm sm:text-base md:text-lg opacity-70 mt-2 flex justify-center flex-wrap gap-1">
      Welcome back,
      <span className="font-black text-(--orange)">
        {name.split(" ")[0]}
      </span>!
    </p>

    {/* Decorative line */}
    <div className="mt-4 flex items-center justify-center gap-2">
      <div className="h-1 w-10 sm:w-12 bg-black rounded-full" />
      <div className="h-1 w-3 sm:w-4 bg-(--orange) rounded-full" />
      <div className="h-1 w-2 bg-(--teal) rounded-full" />
    </div>
  </div>

  {/* Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

    {/* LEFT SIDEBAR */}
    <div className="lg:col-span-4">
      <div className="card bg-white p-5 sm:p-6 sticky top-6">

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-green-300 rounded-full">
              {
                avatar ? (
                  <Image
                    src={avatar}
                    alt={`${name}'s avatar`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-2xl sm:text-3xl md:text-4xl capitalize">
                    {name[0]}
                  </div>
                )
              }
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            {name}
          </h2>

          <p className="text-xs sm:text-sm opacity-70 mb-4 break-all">
            {email}
          </p>

          {
            currentUser?.id !== user?.id && (
              <FollowBtn
                targetUserId={user.id}
                initiallyFollowing={isFollowing}
                onFollowChange={handleFollowChange}
              />
            )
          }
        </div>

        {/* Followers */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#F0E7D6] border-2 border-black">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">
              {followersCount}
            </div>
            <div className="text-xs opacity-70">Followers</div>
          </div>

          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">
              {followingCount}
            </div>
            <div className="text-xs opacity-70">Following</div>
          </div>
        </div>

      </div>
    </div>

    {/* RIGHT CONTENT */}
    <div className="lg:col-span-8">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center btn-rect bg-orange-500 text-white p-4">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {totalPins}
          </div>
          <div className="text-xs sm:text-sm mt-1">Total Pins</div>
        </div>

        <div className="card text-center btn-rect bg-purple-600 text-white p-4">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {totalLikes}
          </div>
          <div className="text-xs sm:text-sm mt-1">Likes</div>
        </div>
      </div>

      {/* Pins Section */}
      <div className="card bg-white p-4 sm:p-6 mb-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 capitalize">
          {name}'s Pins
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {lastUploadedPins.map((u) => (
            <div
              key={u.id}
              className="relative h-24 sm:h-28 md:h-32 group rounded-xl overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={u.mediaUrl}
                alt={u.title}
                fill
                className="object-cover"
                loading="lazy"
              />

              <Link href={`/main/pin/${u.id}`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40">
                  <div className="absolute bottom-0 p-2 w-full">
                    <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                      {u.title}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <Link
          href={`/main/profile/${user.id}/uploads`}
          className="btn-rect capitalize w-full flex justify-center items-center text-sm! sm:text-base line-clamp-1"
        >
          {name.split(" ")[0]}'s Pins <ArrowRightIcon size={15}/>
        </Link>
      </div>

    </div>
  </div>

</main>
  );
}
